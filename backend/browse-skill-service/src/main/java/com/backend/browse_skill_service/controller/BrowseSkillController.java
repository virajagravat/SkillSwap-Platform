package com.backend.browse_skill_service.controller;



import com.backend.browse_skill_service.service.BrowseSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.backend.browse_skill_service.dto.PagedBrowseSkillResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;



import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/browse/skills")
@RequiredArgsConstructor

public class BrowseSkillController {

    private final BrowseSkillService browseSkillService;

    @GetMapping("/search")
    public PagedBrowseSkillResponse searchSkills(
            @RequestParam
            @NotBlank(message = "Skill name must not be blank")
            String name,

            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page must be greater than or equal to 0")
            int page,

            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Size must be greater than 0")
            @Max(value = 100, message = "Size must not be greater than 100")
            int size) {

        return browseSkillService.searchSkills(
                name,
                page,
                size
        );
    }
}
