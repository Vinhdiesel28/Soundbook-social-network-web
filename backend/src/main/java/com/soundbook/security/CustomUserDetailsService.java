package com.soundbook.security;

import com.soundbook.entity.User;
import com.soundbook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private static final String OAUTH_PLACEHOLDER_PASSWORD = "__OAUTH_ONLY_ACCOUNT__";

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy email: " + email));

        String password = (user.getPasswordHash() == null || user.getPasswordHash().trim().isEmpty())
                ? OAUTH_PLACEHOLDER_PASSWORD
                : user.getPasswordHash();

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                password,
                // Lấy role từ DB và thêm tiền tố ROLE_ để Spring Security nhận diện
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
