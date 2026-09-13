package com.backend.skill_swap_request_service.exception;

public class RequestNotFoundException extends RuntimeException {
    public RequestNotFoundException(Long id) {
        super("SkillSwapRequest with id " + id + " not found");
    }
}
