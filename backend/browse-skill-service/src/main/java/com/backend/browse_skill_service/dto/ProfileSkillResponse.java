package com.backend.browse_skill_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileSkillResponse {
    private Long id;

    private ProfileResponse profile;

    private SkillResponse skill;

    private String skillType;
}
