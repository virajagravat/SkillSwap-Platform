package com.backend.profile_service.controller;

import com.backend.profile_service.dto.AddSkillRequest;
import com.backend.profile_service.entity.ProfileSkill;
import com.backend.profile_service.service.ProfileSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileSkillController {

    private final ProfileSkillService profileSkillService;

    @GetMapping("/{profileId}/skills")
    public List<ProfileSkill> getProfileSkills(@PathVariable Long profileId) {
        return profileSkillService.getProfileSkills(profileId);
    }

    @PostMapping("/{profileId}/skills")
    public ProfileSkill addSkillToProfile(
            @PathVariable Long profileId,
            @RequestBody AddSkillRequest request) {

        return profileSkillService.addSkillToProfile(
                profileId,
                request.getSkillId(),
                request.getSkillType()
        );
    }

}
