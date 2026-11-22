package com.backend.session_service.service;

import com.backend.session_service.dto.CreateSessionRequest;
import com.backend.session_service.dto.ScheduleRequest;
import com.backend.session_service.dto.SessionDto;
import com.backend.session_service.entity.SessionEntity;
import com.backend.session_service.entity.SessionStatus;
import com.backend.session_service.exception.SessionNotFoundException;
import com.backend.session_service.repository.SessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository repository;

    // Base Jitsi URL – can be overridden via application.properties
    @Value("${jitsi.base-url:https://meet.jit.si}")
    private String jitsiBaseUrl;

    /** Platform user and request IDs are numeric; encode them losslessly in UUIDs. */
    public static UUID platformIdToUuid(Long id) {
        if (id == null || id < 0) {
            throw new IllegalArgumentException("Platform IDs must be non-negative");
        }
        return new UUID(0L, id);
    }

    @Transactional
    public SessionDto createSession(Long requestId, Long senderId, Long receiverId, String skillName) {
        UUID sessionRequestId = platformIdToUuid(requestId);
        Optional<SessionEntity> existing = repository.findByRequestId(sessionRequestId);
        if (existing.isPresent()) {
            return toDto(existing.get());
        }

        CreateSessionRequest request = new CreateSessionRequest();
        request.setRequestId(sessionRequestId);
        request.setSenderId(platformIdToUuid(senderId));
        request.setReceiverId(platformIdToUuid(receiverId));
        request.setSkillName(skillName);
        return createSession(request);
    }

    public List<SessionDto> getSessionsForUser(Long userId) {
        UUID platformUserId = platformIdToUuid(userId);
        return repository.findBySenderIdOrReceiverId(platformUserId, platformUserId)
                .stream().map(this::toDto).toList();
    }

    /** Create a new session after a request is accepted. */
    @Transactional
    public SessionDto createSession(CreateSessionRequest req) {
        // Ensure no duplicate session for the same request
        if (repository.findByRequestId(req.getRequestId()).isPresent()) {
            throw new IllegalArgumentException("Session already exists for requestId " + req.getRequestId());
        }
        // Generate a deterministic meeting link (will be updated on scheduling)
        String placeholderLink = jitsiBaseUrl + "/placeholder"; // will be replaced later
        SessionEntity entity = SessionEntity.builder()
                .requestId(req.getRequestId())
                .senderId(req.getSenderId())
                .receiverId(req.getReceiverId())
                .skillName(req.getSkillName())
                .status(SessionStatus.PENDING)
                .meetingLink(placeholderLink)
                .build();
        SessionEntity saved = repository.save(entity);
        return toDto(saved);
    }

    /** Schedule date/time for a pending session and generate Jitsi meeting link. */
    @Transactional
    public SessionDto scheduleSession(UUID sessionId, ScheduleRequest schedule) {
        SessionEntity entity = repository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found: " + sessionId));
        if (entity.getStatus() != SessionStatus.PENDING) {
            throw new IllegalStateException("Only PENDING sessions can be scheduled");
        }
        // Validation: end after start, date in future
        if (schedule.getEndTime().isBefore(schedule.getStartTime())) {
            throw new IllegalArgumentException("endTime must be after startTime");
        }
        if (schedule.getSessionDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("sessionDate must be in the future");
        }
        entity.setSessionDate(schedule.getSessionDate());
        entity.setStartTime(schedule.getStartTime());
        entity.setEndTime(schedule.getEndTime());
        // Generate unique meeting link based on sessionId
        String room = "SkillSwap-" + entity.getSessionId();
        String meetingLink = jitsiBaseUrl + "/" + room;
        entity.setMeetingLink(meetingLink);
        entity.setStatus(SessionStatus.SCHEDULED);
        SessionEntity saved = repository.save(entity);
        return toDto(saved);
    }

    /** Activate sessions whose start time has arrived. */
    @Transactional
    public void activateDueSessions() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        // Find sessions that are SCHEDULED and startTime <= now (same day)
        var due = repository.findByStatusAndSessionDateAndStartTimeLessThanEqual(
                SessionStatus.SCHEDULED, today, now);
        for (SessionEntity s : due) {
            s.setStatus(SessionStatus.ACTIVE);
            repository.save(s);
        }
    }

    @Transactional
    public SessionDto completeSession(UUID sessionId) {
        SessionEntity entity = repository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found: " + sessionId));
        if (entity.getStatus() != SessionStatus.ACTIVE) {
            throw new IllegalStateException("Only ACTIVE sessions can be completed");
        }
        entity.setStatus(SessionStatus.COMPLETED);
        SessionEntity saved = repository.save(entity);
        return toDto(saved);
    }

    @Transactional
    public SessionDto cancelSession(UUID sessionId) {
        SessionEntity entity = repository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found: " + sessionId));
        if (entity.getStatus() == SessionStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed session");
        }
        entity.setStatus(SessionStatus.CANCELLED);
        SessionEntity saved = repository.save(entity);
        return toDto(saved);
    }

    public SessionDto getSession(UUID sessionId) {
        SessionEntity entity = repository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found: " + sessionId));
        return toDto(entity);
    }

    private SessionDto toDto(SessionEntity e) {
        SessionDto dto = new SessionDto();
        dto.setSessionId(e.getSessionId());
        dto.setRequestId(e.getRequestId());
        dto.setSenderId(e.getSenderId());
        dto.setReceiverId(e.getReceiverId());
        dto.setSkillName(e.getSkillName());
        dto.setSessionDate(e.getSessionDate());
        dto.setStartTime(e.getStartTime());
        dto.setEndTime(e.getEndTime());
        dto.setStatus(e.getStatus());
        dto.setMeetingLink(e.getMeetingLink());
        return dto;
    }
}
