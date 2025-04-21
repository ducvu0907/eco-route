package com.ducvu.backend_java.exception;

import com.ducvu.backend_java.dto.ApiResponse;
import io.jsonwebtoken.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {  // TODO: refactor to remove hard-coded error messages

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ApiResponse<?>> handleRuntimeException(RuntimeException e) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .message("Uncategorized error")
        .build();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ApiResponse<?>> handleBadCredentialsException(BadCredentialsException e) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .message("Password incorrect")
        .build();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<ApiResponse<?>> handleUsernameNotFoundException(UsernameNotFoundException e) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .message("Username not found")
        .build();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
  }

  @ExceptionHandler(UsernameAlreadyExistsException.class)
  public ResponseEntity<ApiResponse<?>> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException e) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .message("Username already exists")
        .build();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
  }

}
