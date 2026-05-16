package com.ethara.Service;

import com.ethara.dto.MemberProjectResponseDto;
import com.ethara.dto.ProjectResponseDto;
import com.ethara.entity.Project;
import com.ethara.entity.ProjectMember;
import com.ethara.entity.Task;

import jakarta.transaction.Transactional;

import com.ethara.Repository.ProjectMemberRepository;
import com.ethara.Repository.ProjectRepository;
import com.ethara.Repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private ProjectMemberRepository projectMemberRepository;

	@Autowired
	private TaskRepository taskRepository;

	/** ===== CREATE PROJECT ====== */

	public ResponseEntity<?> createProject(Project project) {

		project.setTotalMembers(0);

		project.setTotalTasks(0);

		Project savedProject = projectRepository.save(project);

		return ResponseEntity.ok(savedProject);
	}

	/** ====== GET ALL PROJECTS ======== */

	public ResponseEntity<?> getProjects() {

		List<Project> projects = projectRepository.findAll();

		for (Project project : projects) {

			int memberCount = projectMemberRepository.countByProjectId(project.getId().intValue());

			int taskCount = taskRepository.countByProjectId(project.getId().intValue());

			project.setTotalMembers(memberCount);

			project.setTotalTasks(taskCount);
		}

		return ResponseEntity.ok(projects);
	}

	/** ====== UPDATE PROJECT ============ */

	public ResponseEntity<?> updateProject(Long id, Project updatedProject) {

		Optional<Project> optionalProject = projectRepository.findById(id);

		if (optionalProject.isEmpty()) {

			return ResponseEntity.badRequest().body("Project Not Found");
		}

		Project project = optionalProject.get();

		project.setName(updatedProject.getName());

		project.setDescription(updatedProject.getDescription());

		Project savedProject = projectRepository.save(project);

		return ResponseEntity.ok(savedProject);
	}

	/** ======= DELETE PROJECT ======== */

	public ResponseEntity<?> deleteProject(Long id) {

		projectRepository.deleteById(id);

		return ResponseEntity.ok("Project Deleted Successfully");
	}

}