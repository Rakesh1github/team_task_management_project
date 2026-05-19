package com.ethara.entity;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "tasks")
@Data
public class Task {
    @Id
    private Long id;
    private String title;
    private String project;
    private LocalDate dueDate;
    private String priority;
    private String status;

    
    private int assignedToUserId;

    
    private int projectId;
}
