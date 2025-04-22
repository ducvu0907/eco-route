package com.ducvu.backend_java.service;

import com.ducvu.backend_java.config.JwtService;
import com.ducvu.backend_java.dto.request.AuthRequest;
import com.ducvu.backend_java.dto.request.UserAccountCreateRequest;
import com.ducvu.backend_java.dto.response.AuthResponse;
import com.ducvu.backend_java.dto.response.UserAccountResponse;
import com.ducvu.backend_java.exception.UsernameAlreadyExistsException;
import com.ducvu.backend_java.model.UserAccount;
import com.ducvu.backend_java.repository.UserAccountRepository;
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
  private final UserAccountRepository userAccountRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final Mapper mapper;
  private final Validator validator;

  public UserAccountResponse register(UserAccountCreateRequest request) {
    validator.validate(request);

    userAccountRepository.findByUsername(request.getUsername())
        .ifPresent(u -> { throw new UsernameAlreadyExistsException("Username already exists"); });

    UserAccount userAccount = UserAccount.builder()
        .username(request.getUsername())
        .phone(request.getPhone())
        .fcmToken(request.getFcmToken())
        .hashedPassword(passwordEncoder.encode(request.getPassword()))
        .role(request.getRole())
        .build();

    userAccountRepository.save(userAccount);
    log.info("New account created: {}", userAccount);

    return mapper.map(userAccount);
  }

  public AuthResponse login(AuthRequest request) {
    validator.validate(request);

    UserAccount userAccount = userAccountRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new UsernameNotFoundException("Username not found"));

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()
        )
    );
    log.info("Authenticate user: {}", authentication.getPrincipal());

    String jwt = jwtService.generateToken(userAccount);
    AuthResponse authResponse = AuthResponse.builder()
        .token(jwt)
        .build();

    if (request.getFcmToken() != null && !request.getFcmToken().isEmpty()) {
      log.info("FCM token: {}", request.getFcmToken());
      userAccount.setFcmToken(request.getFcmToken());
      userAccountRepository.save(userAccount);
    }

    return authResponse;
  }

}
