
package com.example.buyer.repo;

import com.example.buyer.model.UserWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserWalletRepository extends JpaRepository<UserWallet, Long> {
    Optional<UserWallet> findByUserId(String userId);
}
