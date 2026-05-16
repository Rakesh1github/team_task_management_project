package com.ethara.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.Repository.ProjectRepository;
import com.ethara.Repository.TaskRepository;
import com.ethara.Service.DashboardService;
import com.ethara.dto.DashboardDTO;
import com.ethara.dto.DashboardResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;
    
    
    @GetMapping("/admin")
    public ResponseEntity<?> getAdminDashboard() {

        return dashboardService
                .getAdminDashboard();
    }
    
    
    
    @GetMapping("/member/{userId}")
    public ResponseEntity<?> getMemberDashboard(

            @PathVariable("userId")
            int userId
    ) {

        return dashboardService
                .getMemberDashboard(userId);
    }
    
    
    
    
}
