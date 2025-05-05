package com.ducvu.backend_java.exception;

import com.ducvu.backend_java.dto.ApiResponse;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.security.SignatureException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<?>> handleException(Exception e) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .message(e.getMessage())
        .build();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiResponse<?>> handleAccessDeniedException(AccessDeniedException e) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .message("You do not have permission")
        .build();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiResponse<?>> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .message("Invalid request format")
        .build();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
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

}
