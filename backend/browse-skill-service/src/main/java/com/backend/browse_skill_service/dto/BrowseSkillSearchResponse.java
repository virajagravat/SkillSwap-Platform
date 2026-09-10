package com.backend.browse_skill_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrowseSkillSearchResponse {

    private Long userId;

    private String name;

    private String profilePhoto;

    private Long skillId;

    private String skillName;

    private String skillType;
}
