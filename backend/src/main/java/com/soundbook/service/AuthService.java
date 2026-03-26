package com.soundbook.service;

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
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;
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

    @Value("${google.client-id}")
    private String googleClientId;

    public AuthResponse login(LoginRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()
                && hasNoPassword(existingUser.get())
                && existingUser.get().getGoogleSub() != null
                && !existingUser.get().getGoogleSub().isBlank()) {
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
            if (idTokenString == null || idTokenString.trim().isEmpty()) {
                throw new RuntimeException("Google ID token bị thiếu.");
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
            String displayName = resolveDisplayName(name, email);

            User user = userRepository.findByEmail(email)
                    .map(existingUser -> updateGoogleAccountInfo(existingUser, googleSub, displayName))
                    .orElseGet(() -> createGoogleUser(email, googleSub, displayName, pictureUrl));

            return generateAuthResponse(user.getEmail());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi đăng nhập Google: " + e.getMessage());
        }
    }

    private AuthResponse generateAuthResponse(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(jwtToken).type("Bearer").build();
    }

    private User createGoogleUser(String email, String googleSub, String displayName, String pictureUrl) {
        User newUser = User.builder()
                .email(email)
                .googleSub(googleSub)
                .displayName(displayName)
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(newUser);
        createDefaultProfileAndOnboarding(savedUser, pictureUrl);
        return savedUser;
    }

    private User updateGoogleAccountInfo(User user, String googleSub, String displayName) {
        boolean changed = false;

        if ((user.getGoogleSub() == null || user.getGoogleSub().isBlank()) && googleSub != null && !googleSub.isBlank()) {
            user.setGoogleSub(googleSub);
            changed = true;
        }

        if (user.getDisplayName() == null || user.getDisplayName().isBlank()) {
            user.setDisplayName(displayName);
            changed = true;
        }

        return changed ? userRepository.save(user) : user;
    }

    private String resolveDisplayName(String googleName, String email) {
        if (googleName != null && !googleName.isBlank()) {
            return googleName;
        }
        return email != null && email.contains("@") ? email.substring(0, email.indexOf('@')) : "Google User";
    }

    private boolean hasNoPassword(User user) {
        return user.getPasswordHash() == null || user.getPasswordHash().isBlank();
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
