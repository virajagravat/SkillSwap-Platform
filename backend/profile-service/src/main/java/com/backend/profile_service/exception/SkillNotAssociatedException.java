package com.backend.profile_service.exception;

public class SkillNotAssociatedException extends RuntimeException{
    public SkillNotAssociatedException(String message) {
        super(message);
    }
}
