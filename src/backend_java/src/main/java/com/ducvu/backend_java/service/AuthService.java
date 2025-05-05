package com.ducvu.backend_java.service;

import com.ducvu.backend_java.config.JwtService;
import com.ducvu.backend_java.dto.request.AuthRequest;
import com.ducvu.backend_java.dto.request.UserCreateRequest;
import com.ducvu.backend_java.dto.response.AuthResponse;
import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.exception.PhoneAlreadyExistsException;
import com.ducvu.backend_java.exception.UsernameAlreadyExistsException;
import com.ducvu.backend_java.model.User;
import com.ducvu.backend_java.repository.UserRepository;
import com.ducvu.backend_java.util.Mapper;
import com.ducvu.backend_java.util.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final Mapper mapper;
  private final Validator validator;

  public UserResponse register(UserCreateRequest request) {
    validator.validate(request);

    userRepository.findByUsername(request.getUsername())
        .ifPresent(u -> { throw new UsernameAlreadyExistsException("Username already exists"); });

    userRepository.findByPhone(request.getPhone())
        .ifPresent(u -> { throw new PhoneAlreadyExistsException("Phone number already exists"); });

    User user = User.builder()
        .username(request.getUsername())
        .phone(request.getPhone())
        .fcmToken(request.getFcmToken())
        .hashedPassword(passwordEncoder.encode(request.getPassword()))
        .role(request.getRole())
        .build();

    userRepository.save(user);
    log.info("New account created: {}", user);

    return mapper.map(user);
  }

  public AuthResponse login(AuthRequest request) {
    validator.validate(request);

    User user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new UsernameNotFoundException("Username not found"));

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()
        )
    );
    log.info("Authenticate user: {}", authentication.getPrincipal());

    String jwt = jwtService.generateToken(user);
    AuthResponse authResponse = AuthResponse.builder()
        .token(jwt)
        .build();

    if (request.getFcmToken() != null && !request.getFcmToken().isEmpty()) {
      log.info("FCM token: {}", request.getFcmToken());
      user.setFcmToken(request.getFcmToken());
      userRepository.save(user);
    }

    return authResponse;
  }

}
