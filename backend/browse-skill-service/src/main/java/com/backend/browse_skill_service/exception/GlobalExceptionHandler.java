package com.backend.browse_skill_service.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HandlerMethodValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleValidationException(
            HandlerMethodValidationException exception) {

        return exception.getParameterValidationResults()
                .stream()
                .flatMap(result -> result.getResolvableErrors().stream())
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
    }
    @ExceptionHandler(ProfileServiceException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public String handleProfileServiceException(
            ProfileServiceException exception) {

        return exception.getMessage();
    }
}
