package com.soundbook.repository;

import com.soundbook.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByGoogleSub(String googleSub);

    @Query("""
            select distinct u
            from User u
            left join UserProfile p on p.user = u
            where u.id <> :currentUserId
              and (
                lower(u.displayName) like lower(concat('%', :keyword, '%'))
                or lower(u.email) like lower(concat('%', :keyword, '%'))
                or lower(p.username) like lower(concat('%', :keyword, '%'))
              )
            order by u.displayName asc
            """)
    List<User> searchUsers(@Param("currentUserId") Long currentUserId, @Param("keyword") String keyword, Pageable pageable);

    @Query("""
            select u
            from User u
            where u.id <> :currentUserId
            order by u.createdAt desc
            """)
    List<User> findCandidateUsers(@Param("currentUserId") Long currentUserId, Pageable pageable);
}
