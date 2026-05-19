package com.ethara.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ethara.entity.Project;

@Repository
public interface ProjectRepository extends MongoRepository<Project, Long> {
	
	
}

