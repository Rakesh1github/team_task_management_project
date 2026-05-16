package com.ethara.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ethara.Repository.ProjectMemberRepository;
import com.ethara.Repository.ProjectRepository;
import com.ethara.Repository.TaskRepository;
import com.ethara.dto.DashboardDTO;
import com.ethara.dto.DashboardResponseDto;
import com.ethara.dto.MemberDashboardResponseDto;
import com.ethara.entity.ProjectMember;
import com.ethara.entity.Task;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

	private final TaskRepository taskRepository;

	private final ProjectRepository projectRepository;
	private final ProjectMemberRepository projectMemberRepository;

	public ResponseEntity<?> getAdminDashboard() {

		DashboardResponseDto dto = new DashboardResponseDto();

		dto.setTotalProjects(projectRepository.count());

		dto.setTotalTasks(taskRepository.count());

		dto.setCompletedTasks(

				taskRepository.countByStatus("Done"));

		dto.setInProgressTasks(

				taskRepository.countByStatus("In Progress"));

		dto.setTodoTasks(

				taskRepository.countByStatus("To Do"));

		long overdue =

				taskRepository.findAll().stream()

						.filter(task ->

						task.getDueDate() != null

								&&

								task.getDueDate().isBefore(LocalDate.now())

								&&

								!task.getStatus().equals("Done"))

						.count();

		dto.setOverdueTasks(overdue);

		return ResponseEntity.ok(dto);
	}

	public ResponseEntity<?> getMemberDashboard(int userId) {

		MemberDashboardResponseDto dto = new MemberDashboardResponseDto();

		List<Task> tasks = taskRepository.findAll();

		List<ProjectMember> members = projectMemberRepository.findAll();

		/* PROJECT COUNT */

		long totalProjects = members.stream()

				.filter(member ->

				member.getUserId() == userId)

				.count();

		dto.setTotalProjects(totalProjects);

		/* USER TASKS */

		List<Task> userTasks = tasks.stream()

				.filter(task ->

				task.getAssignedToUserId() == userId)

				.toList();

		dto.setTotalTasks(userTasks.size());

		dto.setCompletedTasks(

				userTasks.stream()

						.filter(task ->

						task.getStatus().equals("Done"))

						.count());

		dto.setInProgressTasks(

				userTasks.stream()

						.filter(task ->

						task.getStatus().equals("In Progress"))

						.count());

		dto.setTodoTasks(

				userTasks.stream()

						.filter(task ->

						task.getStatus().equals("To Do"))

						.count());

		dto.setOverdueTasks(

				userTasks.stream()

						.filter(task ->

						task.getDueDate() != null

								&&

								task.getDueDate().isBefore(java.time.LocalDate.now())

								&&

								!task.getStatus().equals("Done"))

						.count());

		return ResponseEntity.ok(dto);
	}
}
