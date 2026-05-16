package com.ethara.Controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.Repository.AttendanceRepository;
import com.ethara.Repository.UserRepository;
import com.ethara.entity.Attendance;
import com.ethara.entity.User;
import com.ethara.security.ActivityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/attendance")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<?> markAttendance(@RequestBody Attendance request) {
        Optional<Attendance> existing = attendanceRepository.findByUserIdAndDate(request.getUserId(), request.getDate());
        
        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setStatus(request.getStatus());
            attendance.setMarkedAt(LocalDateTime.now());
        } else {
            attendance = new Attendance();
            attendance.setUserId(request.getUserId());
            attendance.setDate(request.getDate());
            attendance.setStatus(request.getStatus());
            attendance.setMarkedAt(LocalDateTime.now());
        }
        
        attendanceRepository.save(attendance);
        
        activityService.logActivity(request.getUserId(), "ATTENDANCE_MARKED", "Marked as " + request.getStatus() + " for " + request.getDate().toString());
        
        return ResponseEntity.ok("Attendance marked successfully");
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<?> getMonthlySummary(@RequestParam("year") int year, @RequestParam("month") int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<Attendance> allAttendance = attendanceRepository.findByDateBetween(start, end);
        List<User> allUsers = userRepository.findAll();

        List<Map<String, Object>> summaryList = new ArrayList<>();

        for (User user : allUsers) {
            long presentCount = allAttendance.stream()
                .filter(a -> a.getUserId() == user.getId().intValue() && "PRESENT".equalsIgnoreCase(a.getStatus()))
                .count();

            long absentCount = allAttendance.stream()
                .filter(a -> a.getUserId() == user.getId().intValue() && "ABSENT".equalsIgnoreCase(a.getStatus()))
                .count();

            Map<String, Object> userSummary = new HashMap<>();
            userSummary.put("userId", user.getId());
            userSummary.put("name", user.getName());
            userSummary.put("email", user.getEmail());
            userSummary.put("presentDays", presentCount);
            userSummary.put("absentDays", absentCount);
            
            summaryList.add(userSummary);
        }

        return ResponseEntity.ok(summaryList);
    }
    
    @GetMapping("/daily")
    public ResponseEntity<?> getDailyAttendance(@RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        List<Attendance> allAttendance = attendanceRepository.findByDateBetween(date, date);
        return ResponseEntity.ok(allAttendance);
    }
}
