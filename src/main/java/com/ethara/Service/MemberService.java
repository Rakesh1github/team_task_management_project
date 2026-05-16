package com.ethara.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ethara.dto.MemberProjectResponseDto;
import com.ethara.dto.MemberResponseDto;
import com.ethara.entity.Project;
import com.ethara.entity.ProjectMember;
import com.ethara.entity.Task;
import com.ethara.entity.User;
import com.ethara.Repository.ProjectMemberRepository;
import com.ethara.Repository.ProjectRepository;
import com.ethara.Repository.TaskRepository;
import com.ethara.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

	private final ProjectMemberRepository projectMemberRepository;

	private final UserRepository userRepository;
	private final ProjectRepository projectRepository;
	private final TaskRepository taskRepository;

	public ResponseEntity<?> getUsers(int projectId) {

		List<User> users = userRepository.findByRole("MEMBER");

		List<ProjectMember> members = projectMemberRepository.findByProjectId(projectId);

		List<Integer> addedUserIds = new ArrayList<>();

		for (ProjectMember member : members) {

			addedUserIds.add(member.getUserId());
		}

		List<User> availableUsers = new ArrayList<>();

		for (User user : users) {

			if (!addedUserIds.contains(user.getId().intValue())) {

				availableUsers.add(user);
			}
		}

		return ResponseEntity.ok(availableUsers);
	}

	public ResponseEntity<?> getAllMembers() {

		List<ProjectMember> members = projectMemberRepository.findAll();

		List<MemberResponseDto> list = new ArrayList<>();

		for (ProjectMember member : members) {

			User user = userRepository.findById(Long.valueOf(member.getUserId())).orElse(null);

			Project project = projectRepository.findById(Long.valueOf(member.getProjectId())).orElse(null);

			if (user != null) {

				MemberResponseDto dto = new MemberResponseDto();

				dto.setProjectMemberId(member.getId());

				dto.setId(user.getId());

				dto.setName(user.getName());

				dto.setEmail(user.getEmail());

				dto.setProjectName(

						project != null ? project.getName() : "N/A");

				list.add(dto);
			}
		}

		return ResponseEntity.ok(list);
	}

	/** ======== ADD MEMBER =========== */

	public ResponseEntity<?> addMember(ProjectMember projectMember) {

		boolean exists = projectMemberRepository.existsByUserIdAndProjectId(projectMember.getUserId(),
				projectMember.getProjectId());

		if (exists) {

			return ResponseEntity.badRequest().body("Member already added");
		}

		projectMemberRepository.save(projectMember);

		return ResponseEntity.ok("Member Added Successfully");
	}

	/** ===== REMOVE MEMBER ======== */

	public ResponseEntity<?> removeMember(Long id) {

		projectMemberRepository.deleteById(id);

		return ResponseEntity.ok("Member Removed");
	}

	public ResponseEntity<?> getMemberProjects(int userId) {

		List<ProjectMember> members = projectMemberRepository.findAll();

		List<Task> tasks = taskRepository.findAll();

		List<MemberProjectResponseDto> list = new ArrayList<>();

		for (ProjectMember member : members) {

			if (member.getUserId() == userId) {

				Project project = projectRepository.findById(Long.valueOf(member.getProjectId())).orElse(null);

				if (project != null) {

					MemberProjectResponseDto dto = new MemberProjectResponseDto();

					dto.setId(project.getId());

					dto.setName(project.getName());

					dto.setDescription(project.getDescription());

					long totalTasks =

							tasks.stream()

									.filter(task ->

									task.getProjectId() == project.getId()

											&&

											task.getAssignedToUserId() == userId)

									.count();

					dto.setTotalTasks(totalTasks);

					list.add(dto);
				}
			}
		}

		return ResponseEntity.ok(list);
	}

	/** ======== GET MEMBER TASKS ======== */

	public ResponseEntity<?> getMemberTasks(int userId) {

		List<Task> tasks = taskRepository.findAll();

		List<Task> userTasks = tasks.stream()

				.filter(task ->

				task.getAssignedToUserId() == userId)

				.toList();

		return ResponseEntity.ok(userTasks);
	}

	/** ======== UPDATE STATUS ======== */

	public ResponseEntity<?> updateTaskStatus(

			Long taskId,

			Task updatedTask) {

		Task task = taskRepository.findById(taskId).orElse(null);

		if (task == null) {

			return ResponseEntity.badRequest().body("Task Not Found");
		}

		task.setStatus(updatedTask.getStatus());

		taskRepository.save(task);

		return ResponseEntity.ok("Status Updated");
	}
}