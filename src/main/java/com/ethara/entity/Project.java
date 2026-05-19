package com.ethara.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "projects")
@Data
public class Project {
    @Id
    private Long id;
    private String name;
    
    private String description;
    private int totalMembers;

    private int totalTasks;
}
