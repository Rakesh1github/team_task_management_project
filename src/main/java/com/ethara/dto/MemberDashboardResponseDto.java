package com.ethara.dto;

import lombok.Data;

@Data
public class MemberDashboardResponseDto {

    private long totalProjects;

    private long totalTasks;

    private long completedTasks;

    private long inProgressTasks;

    private long todoTasks;

    private long overdueTasks;
}
