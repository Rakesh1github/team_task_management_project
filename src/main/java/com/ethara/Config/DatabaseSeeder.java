package com.ethara.Config;

import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ethara.Repository.UserRepository;
import com.ethara.Repository.ProjectRepository;
import com.ethara.Repository.ProjectMemberRepository;
import com.ethara.entity.User;
import com.ethara.entity.Project;
import com.ethara.entity.ProjectMember;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, 
                          ProjectRepository projectRepository,
                          ProjectMemberRepository projectMemberRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed 3 beautiful Projects if they do not exist
        Project p1 = seedProject("Cloud Migration Suite", "Enterprise-grade AWS cloud migration and scaling infrastructure project.");
        Project p2 = seedProject("AI Task Automation Engine", "Next-gen machine learning workflows for automated ticket processing and intelligence.");
        Project p3 = seedProject("Enterprise CRM Portal", "Premium, sleek corporate customer relationship management dashboard platform.");

        // 2. Seed 5 Member users if they do not exist
        User aditi = seedMember("Aditi Sharma", "aditi@gmail.com");
        User dhananjay = seedMember("Dhananjay Patel", "dhananjay@gmail.com");
        User rohan = seedMember("Rohan Mehta", "rohan@gmail.com");
        User neha = seedMember("Neha Gupta", "neha@gmail.com");
        User vikram = seedMember("Vikram Singh", "vikram@gmail.com");

        // 3. Pre-add them as project members to these seeded projects
        if (p1 != null && p1.getId() != null) {
            int p1Id = p1.getId().intValue();
            addMemberToProject(aditi, p1Id);
            addMemberToProject(dhananjay, p1Id);
            addMemberToProject(rohan, p1Id);
        }
        
        if (p2 != null && p2.getId() != null) {
            int p2Id = p2.getId().intValue();
            addMemberToProject(neha, p2Id);
            addMemberToProject(vikram, p2Id);
        }
        
        System.out.println("--- Seeding Completed Successfully! ---");
    }

    private Project seedProject(String name, String description) {
        List<Project> existing = projectRepository.findAll();
        for (Project p : existing) {
            if (p.getName().equalsIgnoreCase(name)) {
                return p;
            }
        }
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setTotalMembers(0);
        project.setTotalTasks(0);
        project = projectRepository.save(project);
        System.out.println("Seeded project: " + name + " (ID: " + project.getId() + ")");
        return project;
    }

    private User seedMember(String name, String email) {
        org.springframework.security.core.userdetails.UserDetails userDetails = userRepository.findByEmail(email);
        if (userDetails == null) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("123456"));
            user.setRole("MEMBER");
            user.setDate(LocalDate.now());
            user = userRepository.save(user);
            System.out.println("Seeded member: " + name + " (" + email + ") - ID: " + user.getId());
            return user;
        }
        return (User) userDetails;
    }

    private void addMemberToProject(User user, int projectId) {
        if (user != null && user.getId() != null) {
            int userId = user.getId().intValue();
            if (!projectMemberRepository.existsByUserIdAndProjectId(userId, projectId)) {
                ProjectMember member = new ProjectMember();
                member.setUserId(userId);
                member.setProjectId(projectId);
                projectMemberRepository.save(member);
                System.out.println("Assigned " + user.getName() + " to Project ID: " + projectId);
            }
        }
    }
}
