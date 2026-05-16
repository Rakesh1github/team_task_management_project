package com.ethara.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class EmployeeActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private int userId;
    private String actionType; // "JOINED", "MARKED_PRESENT", "ASSIGNED_PROJECT", etc.
    private String description;
    private LocalDateTime timestamp;
}
