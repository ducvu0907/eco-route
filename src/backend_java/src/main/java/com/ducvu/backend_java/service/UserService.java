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

  public List<UserResponse> getDriversNotAssigned() {
    return userRepository.findAll()
        .stream()
        .filter(u -> u.getRole() == Role.DRIVER && u.getVehicle() == null)
        .map(mapper::map)
        .toList();
  }

  public List<UserResponse> getUsers() {
    return userRepository.findAll()
        .stream()
        .map(mapper::map)
        .toList();
  }

  public UserResponse getUserById(String userId) {
    User currentUser = getCurrentUser();
    if (!currentUser.getId().equals(userId) && currentUser.getRole() != Role.MANAGER) {
      throw new RuntimeException("Unauthorized");
    }

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return mapper.map(user);
  }

  // helper for getting the current logged in user
  public User getCurrentUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  public User getManager() {
    return userRepository.findManager()
        .orElseThrow(() -> new RuntimeException("Manager doesn't exist"));
  }

}
