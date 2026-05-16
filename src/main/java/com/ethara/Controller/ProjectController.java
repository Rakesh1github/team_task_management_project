package com.ethara.Controller;

import com.ethara.entity.Project;
import com.ethara.Service.ProjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/projects")
@CrossOrigin("*")
public class ProjectController {

	@Autowired
	private ProjectService projectService;

	/** =========== CREATE PROJECT ========= */
	@PostMapping
	public ResponseEntity<?> createProject(@RequestBody Project project) {

		return projectService.createProject(project);
	}

	/* ====== GET ALL PROJECTS ====== */

	@GetMapping
	public ResponseEntity<?> getProjects() {

		return projectService.getProjects();
	}

	/** ====== UPDATE PROJECT ====== */

	@PutMapping("/{id}")
	public ResponseEntity<?> updateProject(@PathVariable("id") Long id, @RequestBody Project project) {

		return projectService.updateProject(id, project);
	}

	/* ===== DELETE PROJECT ========== */

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteProject(@PathVariable("id") Long id) {

		return projectService.deleteProject(id);
	}

}