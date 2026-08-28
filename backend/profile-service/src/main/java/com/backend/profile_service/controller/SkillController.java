package com.backend.profile_service.controller;


import com.backend.profile_service.entity.Skill;
import com.backend.profile_service.service.SkillService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.backend.profile_service.dto.CreateSkillRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;


import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping("/search")
    public List<Skill> searchSkills(@RequestParam String name) {
        return skillService.searchSkills(name);
    }

    @PostMapping
    public Skill createSkill(@Valid @RequestBody CreateSkillRequest request){
        return skillService.createSkill(request);
    }
}
