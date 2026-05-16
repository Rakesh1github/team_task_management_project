package com.ethara.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ethara.entity.Task;

import jakarta.transaction.Transactional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

	int countByProjectId(int projectId);

	long countByStatus(String status);

	@Modifying
	@Transactional
	@Query("DELETE FROM Task t WHERE t.assignedToUserId = :userId")
	void deleteByAssignedToUserId(@Param("userId") int userId);
}
