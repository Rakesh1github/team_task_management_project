package com.ethara.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Set;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ethara.entity.User;

@Component
public class JwtTokenService {

	private String jwtSecretKey = "asdfhads9f67as98dfyaisudhfa98s67dfy89aishudfuays89dfyasi8df7asdf87987g98a7sg986a89sdf7y";

	private SecretKey getSecretKey() {
		return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
	}

	public String generateAccessToken(User user) {
		return Jwts.builder().subject(user.getEmail()).claim("userId", user.getId().toString())
				.claim("roles", user.getRole()).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 12)).signWith(getSecretKey())
				.compact();
	}

	public String getUsernameFromToken(String token) {
		Claims claims = Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token).getPayload();
		return claims.getSubject();
	}

	public Set<String> getRolesFromToken(String token) {
		Claims claims = Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token).getPayload();
		return claims.get("roles", Set.class);
	}
}
