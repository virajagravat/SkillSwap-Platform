package com.backend.browse_skill_service.exception;

import com.backend.browse_skill_service.exception.ProfileServiceException;
import org.springframework.web.client.RestClientException;

public class ProfileServiceException extends RuntimeException{
    public ProfileServiceException(String message) {
        super(message);
    }

    public ProfileServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
