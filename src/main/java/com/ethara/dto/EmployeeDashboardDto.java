package com.ethara.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDashboardDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    
    private String todayStatus; // "PRESENT", "ABSENT", or null
    private List<ProjectDto> assignedProjects;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectDto {
        private Long id;
        private String name;
    }
}
