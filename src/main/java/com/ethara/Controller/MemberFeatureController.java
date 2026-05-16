package com.ethara.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.Service.MemberService;
import com.ethara.entity.Task;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/member-features")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MemberFeatureController {

	private final MemberService memberService;

	@GetMapping("/projects/{userId}")
	public ResponseEntity<?> getProjects(

			@PathVariable("userId") int userId) {

		return memberService.getMemberProjects(userId);
	}

	/** ================ MEMBER TASKS =================*/

	@GetMapping("/tasks/{userId}")
	public ResponseEntity<?> getTasks(

			@PathVariable("userId") int userId) {

		return memberService.getMemberTasks(userId);
	}

	/** ========================= UPDATE STATUS =========================*/

	@PutMapping("/tasks/{taskId}")
	public ResponseEntity<?> updateStatus(

			@PathVariable("taskId") Long taskId,

			@RequestBody Task task) {

		return memberService.updateTaskStatus(taskId, task);
	}
}
