package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;

import java.lang.annotation.Native;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

  Optional<User> findByUsername(String username);

  Optional<User> findByPhone(String phone);

  @NativeQuery("SELECT * FROM users WHERE role = 'MANAGER' LIMIT 1")
  Optional<User> findManager();
}
