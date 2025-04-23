package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.lang.annotation.Native;
import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, String> {

  Optional<UserAccount> findByUsername(String username);

  Optional<UserAccount> findByPhone(String phone);

}
