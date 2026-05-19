package com.ethara.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ethara.entity.ProjectMember;

@Repository
public interface ProjectMemberRepository extends MongoRepository<ProjectMember, Long> {

	int countByProjectId(int projectId);

	List<ProjectMember> findByProjectId(int projectId);

	boolean existsByUserIdAndProjectId(int userId, int projectId);

	List<ProjectMember> findByUserId(int userId);

	void deleteByUserId(int userId);
}
