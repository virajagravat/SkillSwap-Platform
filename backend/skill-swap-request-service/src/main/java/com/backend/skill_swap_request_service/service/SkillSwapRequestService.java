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

import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer containing the core business rules for skill-swap requests.
 */
@Service
@RequiredArgsConstructor
public class SkillSwapRequestService {

    private final SkillSwapRequestRepository repository;

    private static final List<RequestStatus> ACTIVE_DUPLICATE_STATUSES = List.of(
            RequestStatus.PENDING,
            RequestStatus.TIME_SUGGESTED,
            RequestStatus.PARTICIPANT_SUGGESTED,
            RequestStatus.SCHEDULED,
            RequestStatus.ACCEPTED
    );

    @Transactional
    public SkillSwapRequestResponseDto createRequest(CreateRequestDto dto, Long senderId, Long receiverId) {
        if (senderId.equals(receiverId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot send a skill-swap request to yourself");
        }

        if (repository.existsBySenderIdAndReceiverIdAndSkillIdAndStatusIn(
                senderId,
                receiverId,
                dto.getSkillId(),
                ACTIVE_DUPLICATE_STATUSES
        )) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Duplicate skill-swap request already exists");
        }

        validateTimeWindow(dto.getRequestedStartTime(), dto.getRequestedEndTime());

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

    public List<SkillSwapRequestResponseDto> getSentRequests(Long senderId) {
        return repository.findBySenderId(senderId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SkillSwapRequestResponseDto> getReceivedRequests(Long receiverId) {
        return repository.findByReceiverId(receiverId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillSwapRequestResponseDto suggestTime(Long requestId, SuggestTimeDto dto, Long receiverId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        if (!request.getReceiverId().equals(receiverId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the receiver can suggest a new time");
        }
        validateTimeWindow(dto.getSuggestedStartTime(), dto.getSuggestedEndTime());
        request.setRequestedDate(dto.getSuggestedDate());
        request.setRequestedStartTime(dto.getSuggestedStartTime());
        request.setRequestedEndTime(dto.getSuggestedEndTime());
        request.setMessage(dto.getMessage());
        request.setStatus(RequestStatus.PARTICIPANT_SUGGESTED);
        request.setUpdatedAt(OffsetDateTime.now());
        SkillSwapRequest saved = repository.save(request);
        return mapToResponse(saved);
    }

    @Transactional
    public SkillSwapRequestResponseDto schedule(Long requestId, SuggestTimeDto dto, Long schedulerId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        if (!request.getSenderId().equals(schedulerId) && !request.getReceiverId().equals(schedulerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only participants can schedule the request");
        }
        validateTimeWindow(dto.getSuggestedStartTime(), dto.getSuggestedEndTime());
        request.setProposedDate(dto.getSuggestedDate());
        request.setProposedStartTime(dto.getSuggestedStartTime());
        request.setProposedEndTime(dto.getSuggestedEndTime());
        request.setStatus(RequestStatus.SCHEDULED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    @Transactional
    public SkillSwapRequestResponseDto accept(Long requestId, Long userId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        if (!request.getReceiverId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the receiver can accept the request");
        }
        request.setStatus(RequestStatus.ACCEPTED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    @Transactional
    public SkillSwapRequestResponseDto reject(Long requestId, Long userId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        if (!request.getReceiverId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the receiver can reject the request");
        }
        request.setStatus(RequestStatus.REJECTED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    @Transactional
    public SkillSwapRequestResponseDto cancel(Long requestId, Long userId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        if (!request.getSenderId().equals(userId) && !request.getReceiverId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only participants can cancel the request");
        }
        request.setStatus(RequestStatus.CANCELLED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    @Transactional
    public SkillSwapRequestResponseDto complete(Long requestId, Long userId) {
        SkillSwapRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException(requestId));
        if (!request.getSenderId().equals(userId) && !request.getReceiverId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only participants can complete the request");
        }
        request.setStatus(RequestStatus.COMPLETED);
        request.setUpdatedAt(OffsetDateTime.now());
        return mapToResponse(repository.save(request));
    }

    private void validateTimeWindow(LocalTime startTime, LocalTime endTime) {
        if (!endTime.isAfter(startTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }
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
