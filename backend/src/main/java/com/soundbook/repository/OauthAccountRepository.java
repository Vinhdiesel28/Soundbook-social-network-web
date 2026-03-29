package com.soundbook.repository;

import com.soundbook.entity.OauthAccount;
import com.soundbook.entity.enums.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OauthAccountRepository extends JpaRepository<OauthAccount, Long> {

    Optional<OauthAccount> findByUser_IdAndProvider(Long userId, Provider provider);

    Optional<OauthAccount> findByProviderAndProviderUserId(Provider provider, String providerUserId);
}
