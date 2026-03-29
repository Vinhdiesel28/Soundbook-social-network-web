package com.soundbook.repository;

import com.soundbook.entity.OauthToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OauthTokenRepository extends JpaRepository<OauthToken, Long> {

    Optional<OauthToken> findFirstByOauthAccount_IdOrderByUpdatedAtDesc(Long oauthAccountId);

    void deleteByOauthAccount_Id(Long oauthAccountId);
}
