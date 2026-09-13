package com.backend.skill_swap_request_service.service;

import com.backend.skill_swap_request_service.dto.request.CreateRequestDto;
import com.backend.skill_swap_request_service.dto.request.SuggestTimeDto;
import com.backend.skill_swap_request_service.dto.response.SkillSwapRequestResponseDto;
import com.backend.skill_swap_request_service.entity.SkillSwapRequest;
import com.backend.skill_swap_request_service.enums.RequestStatus;
import com.backend.skill_swap_request_service.exception.RequestNotFoundException;
import com.backend.skill_swap_request_service.repository.SkillSwapRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service layer containing the core business rules for skill‑swap requests.
 */
@Service
@RequiredArgsConstructor
public class SkillSwapRequestService {

    private final SkillSwapRequestRepository repository;

    @Transactional
    public SkillSwapRequestResponseDto createRequest(CreateRequestDto dto, UUID senderId, UUID receiverId) {
        // Duplicate request check
        if (repository.existsBySenderIdAndReceiverIdAndSkillId(senderId, receiverId, dto.getSkillId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Duplicate skill‑swap request already exists");
        }
        // Validate that end time is after start time
        if (!dto.getRequestedEndTime().isAfter(dto.getRequestedStartTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }
        SkillSwapRequest request = SkillSwapRequest.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .skillId(dto.getSkillId())
                .requestedDate(dto.getRequestedDate())
                .requestedStartTime(dto.getRequestedStartTime())
                .requestedEndTime(dto.getRequestedEndTime())
                .message(dto.getMessage())
                .status(RequestStatus.PENDING)
                .build();
        SkillSwapRequest saved = repository.save(request);
        return mapToResponse(saved);
    }

    public SkillSwapRequestResponseDto getById(Long id) {
        SkillSwapRequest request = repository.findById(id)
                .orElseThrow(() -> new RequestNotFoundException(id));
        return mapToResponse(request);
    }

    public List<SkillSwapRequestResponseDto> getSentRequests(UUID senderId) {
        return repository.findBySenderId(senderId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SkillSwapRequestResponseDto> getReceivedRequests(UUID receiverId) {
        return repository.findByReceiverId(receiverId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillSwapRequestResponseDto suggestTime(Long requestId, SuggestTimeDto dto, UUID receiverId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        if (!request.getReceiverId().equals(receiverId)) {
            throw new IllegalArgumentException("Only the receiver can suggest a new time");
        }
        request.setRequestedDate(dto.getSuggestedDate());
        request.setRequestedStartTime(dto.getSuggestedStartTime());
        request.setRequestedEndTime(dto.getSuggestedEndTime());
        request.setMessage(dto.getMessage());
        request.setStatus(RequestStatus.PARTICIPANT_SUGGESTED);
        request.setUpdatedAt(OffsetDateTime.now());
        SkillSwapRequest saved = repository.save(request);
        return mapToResponse(saved);
    }

    // ---------- Additional actions ----------
    @Transactional
    public SkillSwapRequestResponseDto schedule(Long requestId, SuggestTimeDto dto, UUID schedulerId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        // only participants can schedule
        if (!request.getSenderId().equals(schedulerId) && !request.getReceiverId().equals(schedulerId)) {
            throw new IllegalArgumentException("Only participants can schedule the request");
        }
        request.setProposedDate(dto.getSuggestedDate());
        request.setProposedStartTime(dto.getSuggestedStartTime());
        request.setProposedEndTime(dto.getSuggestedEndTime());
        request.setStatus(RequestStatus.SCHEDULED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    @Transactional
    public SkillSwapRequestResponseDto accept(Long requestId, UUID userId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        request.setStatus(RequestStatus.ACCEPTED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    @Transactional
    public SkillSwapRequestResponseDto reject(Long requestId, UUID userId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        request.setStatus(RequestStatus.REJECTED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    @Transactional
    public SkillSwapRequestResponseDto cancel(Long requestId, UUID userId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        request.setStatus(RequestStatus.CANCELLED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    @Transactional
    public SkillSwapRequestResponseDto complete(Long requestId, UUID userId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        request.setStatus(RequestStatus.COMPLETED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    private SkillSwapRequestResponseDto mapToResponse(SkillSwapRequest request) {
        SkillSwapRequestResponseDto dto = new SkillSwapRequestResponseDto();
        dto.setId(request.getId());
        dto.setSenderId(request.getSenderId());
        dto.setReceiverId(request.getReceiverId());
        dto.setSkillId(request.getSkillId());
        dto.setStatus(request.getStatus());
        dto.setRequestedDate(request.getRequestedDate());
        dto.setRequestedStartTime(request.getRequestedStartTime());
        dto.setRequestedEndTime(request.getRequestedEndTime());
        dto.setMessage(request.getMessage());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        return dto;
    }
}
