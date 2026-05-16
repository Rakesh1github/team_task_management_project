package com.ethara.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ethara.entity.ProjectMember;
import com.ethara.Service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MemberController {

	private final MemberService memberService;

	@GetMapping("/users/{projectId}")
	public ResponseEntity<?> getUsers(

			@PathVariable("projectId") int projectId) {

		return memberService.getUsers(projectId);
	}

	@GetMapping
	public ResponseEntity<?> getAllMembers() {

		return memberService.getAllMembers();
	}

	@PostMapping
	public ResponseEntity<?> addMember(@RequestBody ProjectMember projectMember) {

		return memberService.addMember(projectMember);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> removeMember(

			@PathVariable("id") Long id) {

		return memberService.removeMember(id);
	}
}