package com.soundbook.repository;

import com.soundbook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA sẽ tự động dịch hàm này thành:
    // SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Bạn có thể khai báo sẵn vài hàm này để dùng cho bước Đăng ký (Register) sau này
    boolean existsByEmail(String email);

    Optional<User> findByGoogleSub(String googleSub);
}