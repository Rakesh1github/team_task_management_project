package com.ethara.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.Service.TaskService;
import com.ethara.entity.Task;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TaskController {

	private final TaskService taskService;

	@PostMapping
	public ResponseEntity<?> createTask(@RequestBody Task task) {

		return taskService.createTask(task);
	}

	@GetMapping
	public ResponseEntity<?> getTasks() {

		return taskService.getTasks();
	}

	/** ====== GET MEMBERS BY PROJECT ====== */

	@GetMapping("/project-members/{id}")
	public ResponseEntity<?> getProjectMembers(@PathVariable("id") int id) {

		return taskService.getMembersByProject(id);
	}

	@GetMapping("/projects")
	public ResponseEntity<?> getProjects() {

		return taskService.getProjects();
	}

	@org.springframework.web.bind.annotation.DeleteMapping("/{id}")
	public ResponseEntity<?> deleteTask(@PathVariable("id") Long id) {

		return taskService.deleteTask(id);
	}

}
