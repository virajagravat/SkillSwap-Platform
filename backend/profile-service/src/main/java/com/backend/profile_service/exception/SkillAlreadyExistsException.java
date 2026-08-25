package com.backend.profile_service.exception;

public class SkillAlreadyExistsException extends RuntimeException{
    public SkillAlreadyExistsException(String message) {
        super(message);
    }
}
