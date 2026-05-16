package com.ethara.security;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ethara.Repository.UserRepository;
import com.ethara.dto.AuthResponseDTO;
import com.ethara.dto.LoginRequestDTO;
import com.ethara.dto.SignupRequestDto;
import com.ethara.dto.SignupResponseDto;
import com.ethara.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenService jwtTokenService;

    // ==========================
    // SIGNUP
    // ==========================
    public SignupResponseDto signup(
            SignupRequestDto signupRequestDto
    ) {

        // DEBUG ROLE
        System.out.println(
                "ROLE RECEIVED : "
                + signupRequestDto.getRole()
        );

        User existingUser =
                (User) userRepository.findByEmail(
                        signupRequestDto.getEmail()
                );

        if (existingUser != null) {

            throw new IllegalArgumentException(
                    "User already exists"
            );

        }

        User user = new User();

        // SAVE ROLE
        user.setRole(
                signupRequestDto.getRole() != null
                        ? signupRequestDto
                                .getRole()
                                .toUpperCase()
                        : "MEMBER"
        );

        user.setName(
                signupRequestDto.getName()
        );

        user.setEmail(
                signupRequestDto.getEmail()
        );

        user.setPassword(
                passwordEncoder.encode(
                        signupRequestDto.getPassword()
                )
        );

        user.setDate(
                LocalDate.now()
        );

        userRepository.save(user);

        return new SignupResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

    }

    // ==========================
    // LOGIN
    // ==========================
    public AuthResponseDTO login(
            LoginRequestDTO loginRequestDto
    ) {

        try {

            Authentication authentication =
                    authenticationManager.authenticate(

                            new UsernamePasswordAuthenticationToken(
                                    loginRequestDto.getEmail(),
                                    loginRequestDto.getPassword()
                            )

                    );

            User user =
                    (User) authentication.getPrincipal();

            String token =
                    jwtTokenService.generateAccessToken(
                            user
                    );

            return new AuthResponseDTO(
                    token,
                    user.getEmail(),
                    user.getRole(),
                    user.getName(),
                    user.getId()
            );

        } catch (Exception ex) {

            return new AuthResponseDTO(
                    null,
                    null,
                    "Invalid username or password",
                    null,
                    null
            );

        }

    }

}