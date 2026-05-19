package com.ethara.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ethara.entity.Task;

@Repository
public interface TaskRepository extends MongoRepository<Task, Long> {

	int countByProjectId(int projectId);

	long countByStatus(String status);

	void deleteByAssignedToUserId(int userId);
}
