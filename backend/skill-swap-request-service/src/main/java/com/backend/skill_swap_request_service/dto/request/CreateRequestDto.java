package com.backend.skill_swap_request_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.*;
import java.util.UUID;

/**
 * DTO used when a requester creates a new skill‑swap request.
 */
@Data
public class CreateRequestDto {

    @NotNull(message = "skillId is required")
    private UUID skillId;

    @NotNull(message = "receiverId is required")
    private UUID receiverId;

    @NotNull(message = "requestedDate is required")
    @FutureOrPresent(message = "requestedDate must be today or in the future")
    private LocalDate requestedDate;

    @NotNull(message = "requestedStartTime is required")
    private LocalTime requestedStartTime;

    @NotNull(message = "requestedEndTime is required")
    private LocalTime requestedEndTime;

    @Size(max = 500, message = "message must be at most 500 characters")
    private String message;
}
