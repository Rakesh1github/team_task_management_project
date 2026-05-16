package com.ethara.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.dto.AuthResponseDTO;
import com.ethara.dto.LoginRequestDTO;
import com.ethara.dto.SignupRequestDto;
import com.ethara.dto.SignupResponseDto;

import com.ethara.security.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(@RequestBody SignupRequestDto signupRequestDto) {
    	return ResponseEntity.ok(authService.signup(signupRequestDto));
    }

    @PostMapping("login")
	public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO){
		return ResponseEntity.ok(authService.login(loginRequestDTO));
	}
}
 