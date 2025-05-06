package com.ducvu.backend_java.service;

import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.model.Role;
import com.ducvu.backend_java.model.User;
import com.ducvu.backend_java.repository.UserRepository;
import com.ducvu.backend_java.util.Mapper;
import com.ducvu.backend_java.util.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
  private final UserRepository userRepository;
  private final Validator validator;
  private final Mapper mapper;

  public List<UserResponse> getUsers(Role role) {
    List<User> users = userRepository.findAll();
    if (role != null) {
      return users
          .stream()
          .filter(u -> u.getRole() == role)
          .map(mapper::map)
          .toList();
    }

    return users
        .stream()
        .map(mapper::map)
        .toList();
  }

  public UserResponse getUser(String userId) {
    User user = getCurrentUser();
    if (!user.getId().equals(userId) && user.getRole() != Role.MANAGER) {
      throw new RuntimeException("Unauthorized");
    }

    return mapper.map(user);
  }

  // helper for getting the current logged in user
  public User getCurrentUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

}
