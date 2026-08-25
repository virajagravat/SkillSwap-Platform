package com.backend.profile_service.exception;

public class SkillNotFoundException extends RuntimeException{

    public SkillNotFoundException(String message) {
        super(message);
    }
}
