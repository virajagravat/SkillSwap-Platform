package com.backend.profile_service.dto;


import com.backend.profile_service.entity.SkillType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddSkillRequest {
    private Long skillId;

    private SkillType skillType;
}
