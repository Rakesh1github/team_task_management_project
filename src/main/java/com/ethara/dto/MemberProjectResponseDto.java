package com.ethara.dto;

import lombok.Data;

@Data
public class MemberProjectResponseDto {

    private Long id;

    private String name;

    private String description;

    private long totalTasks;
}
