package com.ethara.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ethara.Repository.ProjectMemberRepository;
import com.ethara.Repository.ProjectRepository;
import com.ethara.Repository.TaskRepository;
import com.ethara.Repository.UserRepository;
import com.ethara.dto.TaskResponseDto;
import com.ethara.entity.Project;
import com.ethara.entity.ProjectMember;
import com.ethara.entity.Task;
import com.ethara.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

	private final TaskRepository taskRepository;

	private final ProjectRepository projectRepository;

	private final ProjectMemberRepository projectMemberRepository;

	private final UserRepository userRepository;

	public ResponseEntity<?> createTask(Task task) {

		task.setStatus("To Do");

		Task savedTask = taskRepository.save(task);

		return ResponseEntity.ok(savedTask);
	}

	/** ======= GET ALL TASKS ============== */

	public ResponseEntity<?> getTasks() {

		List<Task> tasks = taskRepository.findAll();

		List<TaskResponseDto> list = new ArrayList<>();

		for (Task task : tasks) {

			TaskResponseDto dto = new TaskResponseDto();

			dto.setId(task.getId());

			dto.setTitle(task.getTitle());

			dto.setProject(task.getProject());

			dto.setPriority(task.getPriority());

			dto.setStatus(task.getStatus());

			dto.setDueDate(

					task.getDueDate() != null ? task.getDueDate().toString() : "N/A");

			/* USER NAME */

			User user = userRepository.findById(Long.valueOf(task.getAssignedToUserId())).orElse(null);

			if (user != null) {

				dto.setAssignedTo(user.getName());

			} else {

				dto.setAssignedTo("N/A");
			}

			list.add(dto);
		}

		return ResponseEntity.ok(list);
	}

	/** ======== GET MEMBERS BY PROJECT ====== */

	public ResponseEntity<?> getMembersByProject(int projectId) {

		List<ProjectMember> members = projectMemberRepository.findByProjectId(projectId);

		List<User> users = new ArrayList<>();

		for (ProjectMember member : members) {

			User user = userRepository.findById((long) member.getUserId()).orElse(null);

			if (user != null) {

				users.add(user);
			}
		}

		return ResponseEntity.ok(users);
	}

	
	
	

	public ResponseEntity<?> getProjects() {

		List<Project> projects = projectRepository.findAll();

		return ResponseEntity.ok(projects);
	}

	public ResponseEntity<?> deleteTask(Long id) {
		taskRepository.deleteById(id);
		return ResponseEntity.ok("Task Deleted Successfully");
	}

}
