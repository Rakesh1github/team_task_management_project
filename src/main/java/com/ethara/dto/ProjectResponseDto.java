package com.ethara.dto;

import lombok.Data;

@Data
public class ProjectResponseDto {
	 private Long id;

	    private String name;

	    private String description;

	    private Long totalMembers;

	    private Long totalTasks;
}
