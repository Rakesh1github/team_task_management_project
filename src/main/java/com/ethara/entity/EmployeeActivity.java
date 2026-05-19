package com.ethara.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "employee_activities")
@Data
public class EmployeeActivity {
    @Id
    private Long id;
    
    private int userId;
    private String actionType; // "JOINED", "MARKED_PRESENT", "ASSIGNED_PROJECT", etc.
    private String description;
    private LocalDateTime timestamp;
}
