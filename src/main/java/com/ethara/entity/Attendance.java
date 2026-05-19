package com.ethara.entity;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDateTime;

@Document(collection = "attendances")
@Data
public class Attendance {
    @Id
    private Long id;
    
    private int userId;
    private LocalDate date;
    private String status; // "PRESENT", "ABSENT"
    private LocalDateTime markedAt;
}
