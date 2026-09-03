package com.backend.browse_skill_service.controller;


import com.backend.browse_skill_service.dto.BrowseSkillSearchResponse;
import com.backend.browse_skill_service.service.BrowseSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/browse/skills")
@RequiredArgsConstructor
public class BrowseSkillController {

    private final BrowseSkillService browseSkillService;

    @GetMapping("/search")
    public List<BrowseSkillSearchResponse> searchSkills(
            @RequestParam String name) {

        return browseSkillService.searchSkills(name);
    }
}
