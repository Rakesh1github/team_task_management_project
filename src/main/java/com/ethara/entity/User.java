package com.ethara.entity;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;



@Document(collection = "users")
@Data
public class User implements UserDetails {
    @Id
    private Long id;
    private String name;
    private String email;
    private String password;
    private LocalDate date;
    private String role; // ADMIN / MEMBER
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return List.of(new SimpleGrantedAuthority("ROLE_" + role));
	}
	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return email;
	}
}
