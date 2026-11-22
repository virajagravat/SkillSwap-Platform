package com.backend.session_service.controller;

import com.backend.session_service.dto.CreateSessionRequest;
import com.backend.session_service.dto.CreatePlatformSessionRequest;
import com.backend.session_service.dto.ScheduleRequest;
import com.backend.session_service.dto.SessionDto;
import com.backend.session_service.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import java.net.URI;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    public ResponseEntity<SessionDto> createSession(@Valid @RequestBody CreateSessionRequest request) {
        SessionDto dto = sessionService.createSession(request);
        return ResponseEntity.created(URI.create("/sessions/" + dto.getSessionId())).body(dto);
    }

    @PostMapping("/from-request")
    public ResponseEntity<SessionDto> createFromAcceptedRequest(
            @Valid @RequestBody CreatePlatformSessionRequest request) {
        SessionDto dto = sessionService.createSession(
                request.getRequestId(), request.getSenderId(), request.getReceiverId(), request.getSkillName());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SessionDto>> getForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getSessionsForUser(userId));
    }


    @PutMapping("/{sessionId}/schedule")
    public ResponseEntity<SessionDto> schedule(@PathVariable UUID sessionId,
                                               @Valid @RequestBody ScheduleRequest schedule) {
        SessionDto dto = sessionService.scheduleSession(sessionId, schedule);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{sessionId}/activate")
    public ResponseEntity<Void> activate(@PathVariable UUID sessionId) {
        sessionService.activateDueSessions(); // not typical, but expose for manual trigger
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<SessionDto> complete(@PathVariable UUID sessionId) {
        SessionDto dto = sessionService.completeSession(sessionId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{sessionId}/cancel")
    public ResponseEntity<SessionDto> cancel(@PathVariable UUID sessionId) {
        SessionDto dto = sessionService.cancelSession(sessionId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionDto> get(@PathVariable UUID sessionId) {
        SessionDto dto = sessionService.getSession(sessionId);
        return ResponseEntity.ok(dto);
    }
}
