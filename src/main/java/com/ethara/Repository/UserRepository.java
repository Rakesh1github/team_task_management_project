package com.ethara.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.ethara.entity.User;

@Repository
public interface UserRepository extends MongoRepository<User, Long> {

	UserDetails findByEmail(String email);

	List<User> findByRole(String role);

}
