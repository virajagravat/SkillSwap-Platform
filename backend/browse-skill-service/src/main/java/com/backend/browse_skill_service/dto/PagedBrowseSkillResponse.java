package com.backend.browse_skill_service.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagedBrowseSkillResponse {

    private List<BrowseSkillSearchResponse> content;

    private int page;

    private int size;

    private long totalElements;

    private int totalPages;
}
