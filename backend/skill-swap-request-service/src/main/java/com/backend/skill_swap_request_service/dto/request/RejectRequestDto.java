package com.backend.skill_swap_request_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO used when a receiver rejects a skill‑swap request.
 * Contains a mandatory reason explaining the rejection.
 */
@Data
public class RejectRequestDto {
    @NotBlank(message = "Reason for rejection is required")
    private String reason;
}
