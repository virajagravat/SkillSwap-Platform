package com.backend.profile_service.dto;


import com.backend.profile_service.entity.SkillType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddSkillRequest {

    @NotNull
    private Long skillId;

    @NotNull
    private SkillType skillType;
}
