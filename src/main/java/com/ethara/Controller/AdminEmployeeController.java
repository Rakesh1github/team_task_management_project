package com.ethara.Controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.Repository.AttendanceRepository;
import com.ethara.Repository.EmployeeActivityRepository;
import com.ethara.Repository.ProjectMemberRepository;
import com.ethara.Repository.ProjectRepository;
import com.ethara.Repository.TaskRepository;
import com.ethara.Repository.UserRepository;
import com.ethara.dto.EmployeeDashboardDto;
import com.ethara.dto.EmployeeDashboardDto.ProjectDto;
import com.ethara.dto.SignupRequestDto;
import com.ethara.dto.SignupResponseDto;
import com.ethara.entity.Attendance;
import com.ethara.entity.Project;
import com.ethara.entity.ProjectMember;
import com.ethara.entity.User;
import com.ethara.security.ActivityService;
import com.ethara.security.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/employees")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminEmployeeController {

    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final AttendanceRepository attendanceRepository;
    private final EmployeeActivityRepository activityRepository;
    private final AuthService authService;
    private final ActivityService activityService;

    @GetMapping
    public ResponseEntity<List<User>> getAllEmployees() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<List<EmployeeDashboardDto>> getDashboardData() {
        List<User> users = userRepository.findAll();
        List<EmployeeDashboardDto> dashboardData = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (User user : users) {
            EmployeeDashboardDto dto = new EmployeeDashboardDto();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());

            // Attendance
            Optional<Attendance> todayAtt = attendanceRepository.findByUserIdAndDate(user.getId().intValue(), today);
            dto.setTodayStatus(todayAtt.isPresent() ? todayAtt.get().getStatus() : null);

            // Projects
            List<ProjectMember> memberships = projectMemberRepository.findByUserId(user.getId().intValue());
            List<ProjectDto> assignedProjects = new ArrayList<>();
            for (ProjectMember pm : memberships) {
                Optional<Project> pOpt = projectRepository.findById((long) pm.getProjectId());
                if (pOpt.isPresent()) {
                    assignedProjects.add(new ProjectDto(pOpt.get().getId(), pOpt.get().getName()));
                }
            }
            dto.setAssignedProjects(assignedProjects);
            dashboardData.add(dto);
        }

        return ResponseEntity.ok(dashboardData);
    }

    @GetMapping("/{id}/activity")
    public ResponseEntity<?> getEmployeeActivity(@PathVariable("id") int id) {
        return ResponseEntity.ok(activityRepository.findByUserIdOrderByTimestampDesc(id));
    }

    @PostMapping
    public ResponseEntity<?> addEmployee(@RequestBody SignupRequestDto dto) {
        SignupResponseDto response = authService.signup(dto);
        activityService.logActivity(response.getId().intValue(), "ACCOUNT_CREATED", "Account created as " + dto.getRole());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("id") Long id) {
        int userId = id.intValue();
        
        // Cascade delete
        taskRepository.deleteByAssignedToUserId(userId);
        projectMemberRepository.deleteByUserId(userId);
        attendanceRepository.deleteByUserId(userId);
        activityRepository.deleteByUserId(userId);
        
        userRepository.deleteById(id);
        
        return ResponseEntity.ok("Employee and associated data deleted successfully");
    }
}
