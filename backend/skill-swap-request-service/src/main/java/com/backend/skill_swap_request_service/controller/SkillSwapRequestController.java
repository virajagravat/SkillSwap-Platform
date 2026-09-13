package com.backend.skill_swap_request_service.controller;

import com.backend.skill_swap_request_service.dto.request.CreateRequestDto;
import com.backend.skill_swap_request_service.dto.request.SuggestTimeDto;
import com.backend.skill_swap_request_service.dto.response.SkillSwapRequestResponseDto;
import com.backend.skill_swap_request_service.service.SkillSwapRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.UUID;

/**
 * REST controller exposing CRUD‑like operations for skill‑swap requests.
 *
 * For brevity authentication/authorization is represented by explicit UUID parameters.
 */
@RestController
@RequestMapping("/api/skill-swap-requests")
@RequiredArgsConstructor
@Validated
public class SkillSwapRequestController {

    private final SkillSwapRequestService service;

    @PostMapping
    public ResponseEntity<SkillSwapRequestResponseDto> createRequest(@RequestBody @Validated CreateRequestDto dto) {
        UUID senderId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(service.createRequest(dto, senderId, dto.getReceiverId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillSwapRequestResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<SkillSwapRequestResponseDto>> getSent(@RequestParam UUID senderId) {
        return ResponseEntity.ok(service.getSentRequests(senderId));
    }

    @GetMapping("/received")
    public ResponseEntity<List<SkillSwapRequestResponseDto>> getReceived(@RequestParam UUID receiverId) {
        return ResponseEntity.ok(service.getReceivedRequests(receiverId));
    }

    @PostMapping("/{id}/suggest-time")
    public ResponseEntity<SkillSwapRequestResponseDto> suggestTime(
            @PathVariable Long id,
            @RequestBody @Validated SuggestTimeDto dto,
            @RequestParam UUID receiverId) {
        return ResponseEntity.ok(service.suggestTime(id, dto, receiverId));
    }
}
