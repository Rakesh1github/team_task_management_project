package com.ethara.dto;

import lombok.Data;

@Data
public class TaskResponseDto {

    private Long id;

    private String title;

    private String project;

    private String assignedTo;

    private String dueDate;

    private String priority;

    private String status;
}