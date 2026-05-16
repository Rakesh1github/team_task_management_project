package com.ethara.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardDTO {
    private long totalTasks;
    private long todo;
    private long inProgress;
    private long done;
    private long overdue;
}
