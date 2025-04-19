package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, String> {
  @Query(value = "SELECT * FROM user_account WHERE email = :email", nativeQuery = true)
  Optional<UserAccount> findByEmail(String email);
}
