package com.backend.skill_swap_request_service.controller;

import com.backend.skill_swap_request_service.entity.Skill;
import com.backend.skill_swap_request_service.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * Simple read‑only controller exposing the catalog of available skills.
 * Used by the frontend to populate the "skill you want to learn" dropdown.
 */
@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillRepository skillRepository;

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillRepository.findAll());
    }
}
