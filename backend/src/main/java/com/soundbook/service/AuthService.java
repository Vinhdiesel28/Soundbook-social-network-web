package com.soundbook.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.request.LoginRequest;
import com.soundbook.dto.request.RegisterRequest;
import com.soundbook.dto.response.AuthResponse;
import com.soundbook.entity.User;
import com.soundbook.entity.UserOnboarding;
import com.soundbook.entity.UserProfile;
import com.soundbook.entity.enums.ThemeMode;
import com.soundbook.entity.enums.UserRole;
import com.soundbook.entity.enums.UserStatus;
import com.soundbook.repository.UserOnboardingRepository;
import com.soundbook.repository.UserProfileRepository;
import com.soundbook.repository.UserRepository;
import com.soundbook.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserProfileRepository userProfileRepository;
    private final UserOnboardingRepository userOnboardingRepository;
    private final TokenBlacklistService tokenBlacklistService;

    @Value("${google.client-id}")
    private String googleClientId;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Incorrect email or password"));

        if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            throw new AppException(ErrorCode.USER_MOVED);
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        return generateAuthResponse(request.getEmail());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);
        createDefaultProfileAndOnboarding(user, null);

        return generateAuthResponse(user.getEmail());
    }

    @Transactional
    public AuthResponse loginWithGoogle(String idTokenString) {
        try {
            if (idTokenString == null || idTokenString.isBlank()) {
                throw new RuntimeException("Google idToken bị thiếu.");
            }

            if (googleClientId == null || googleClientId.trim().isEmpty()) {
                System.err.println("--- ERROR: googleClientId is NULL/EMPTY! Check application.properties ---");
                throw new RuntimeException("Cấu hình google.client-id bị thiếu ở Backend.");
            }

            System.out.println("Sử dụng Google Client ID: " + googleClientId);

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new RuntimeException("Xác thực Google với server Google thất bại!");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String googleSub = payload.getSubject();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            User user = userRepository.findByEmail(email).map(existingUser -> {
                boolean changed = false;

                if ((existingUser.getGoogleSub() == null || existingUser.getGoogleSub().isBlank())
                        && googleSub != null && !googleSub.isBlank()) {
                    existingUser.setGoogleSub(googleSub);
                    changed = true;
                }

                if ((existingUser.getDisplayName() == null || existingUser.getDisplayName().isBlank())
                        && name != null && !name.isBlank()) {
                    existingUser.setDisplayName(name);
                    changed = true;
                }

                return changed ? userRepository.save(existingUser) : existingUser;
            }).orElseGet(() -> {
                User newUser = User.builder()
                        .email(email)
                        .googleSub(googleSub)
                        .displayName(name != null && !name.isBlank() ? name : email)
                        .role(UserRole.USER)
                        .status(UserStatus.ACTIVE)
                        .build();
                User savedUser = userRepository.save(newUser);
                createDefaultProfileAndOnboarding(savedUser, pictureUrl);
                return savedUser;
            });

            return generateAuthResponse(user.getEmail());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi đăng nhập Google: " + e.getMessage());
        }
    }

    public void logout(String email, String authorizationHeader) {
        try {
            if (email == null || email.isBlank()) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            String token = authorizationHeader.substring(7).trim();
            if (token.isEmpty()) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            if (!email.equals(jwtService.extractUsername(token))) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            tokenBlacklistService.blacklistToken(token, jwtService.extractExpiration(token));
            SecurityContextHolder.clearContext();
        } catch (AppException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private AuthResponse generateAuthResponse(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(jwtToken).type("Bearer").build();
    }

    private void createDefaultProfileAndOnboarding(User user, String avatarUrl) {
        String baseUsername = user.getEmail().split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        String uniqueUsername = baseUsername + "_" + UUID.randomUUID().toString().substring(0, 5);

        UserProfile profile = UserProfile.builder()
                .user(user)
                .username(uniqueUsername)
                .avatarUrl(avatarUrl)
                .themeMode(ThemeMode.AUTO)
                .allowPreviewPlayer(true)
                .build();
        userProfileRepository.save(profile);

        UserOnboarding onboarding = UserOnboarding.builder()
                .user(user)
                .musicConnected(false)
                .musicDnaReady(false)
                .bookDnaReady(false)
                .tasteDnaReady(false)
                .build();
        userOnboardingRepository.save(onboarding);
    }
}
