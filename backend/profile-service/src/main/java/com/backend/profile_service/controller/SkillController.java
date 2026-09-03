package com.backend.profile_service.controller;


import com.backend.profile_service.entity.Skill;
import com.backend.profile_service.service.SkillService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.backend.profile_service.dto.CreateSkillRequest;
import jakarta.validation.Valid;
import com.backend.profile_service.entity.ProfileSkill;
import com.backend.profile_service.entity.SkillType;


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

    @GetMapping("/{skillId}/profiles")
    public List<ProfileSkill> getProfilesBySkill(
            @PathVariable Long skillId,
            @RequestParam(defaultValue = "TEACH") SkillType skillType) {

        return skillService.getProfilesBySkill(skillId, skillType);
    }
}
