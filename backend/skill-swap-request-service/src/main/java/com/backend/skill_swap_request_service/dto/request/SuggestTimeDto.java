package com.backend.skill_swap_request_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.*;
import java.util.UUID;

/**
 * DTO for suggesting a new time window for an existing request.
 */
@Data
public class SuggestTimeDto {

    @NotNull(message = "suggestedDate is required")
    @FutureOrPresent(message = "suggestedDate must be today or in the future")
    private LocalDate suggestedDate;

    @NotNull(message = "suggestedStartTime is required")
    private LocalTime suggestedStartTime;

    @NotNull(message = "suggestedEndTime is required")
    private LocalTime suggestedEndTime;

    @Size(max = 500, message = "message must be at most 500 characters")
    private String message;
}
