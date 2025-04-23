package com.ducvu.backend_java.exception;

public class PhoneAlreadyExistsException extends RuntimeException {
  public PhoneAlreadyExistsException(String message) {
    super(message);
  }
}
