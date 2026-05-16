package com.ethara.dto;

import lombok.Data;

@Data
public class DashboardResponseDto {

    private long totalProjects;

    private long totalTasks;

    private long completedTasks;

    private long inProgressTasks;

    private long todoTasks;

    private long overdueTasks;
}