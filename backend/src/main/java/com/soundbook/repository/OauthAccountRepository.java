package com.soundbook.repository;

import com.soundbook.entity.OauthAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OauthAccountRepository extends JpaRepository<OauthAccount, Long> {
}
