
package com.example.buyer.repo;

import com.example.buyer.model.AutoOrderRule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RuleRepository extends JpaRepository<AutoOrderRule, Long> {
}
