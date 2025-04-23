package com.ducvu.backend_java.service;

import com.ducvu.backend_java.dto.response.UserAccountResponse;
import com.ducvu.backend_java.exception.PhoneAlreadyExistsException;
import com.ducvu.backend_java.model.UserAccount;
import com.ducvu.backend_java.repository.UserAccountRepository;
import com.ducvu.backend_java.util.Mapper;
import com.ducvu.backend_java.util.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserAccountService {
  private final UserAccountRepository userAccountRepository;
  private final Validator validator;
  private final Mapper mapper;

  public UserAccountResponse getMe() {
    String username = getCurrentUsername();
    UserAccount userAccount = userAccountRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("Username not found"));
    return mapper.map(userAccount);
  }

  // helper for getting the extracted username from authorization header
  public String getCurrentUsername() {
    return SecurityContextHolder.getContext().getAuthentication().getName();
  }

}
