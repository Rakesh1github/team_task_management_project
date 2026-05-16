package com.ethara.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ethara.entity.ProjectMember;

import jakarta.transaction.Transactional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

	int countByProjectId(int projectId);

	List<ProjectMember> findByProjectId(int projectId);

	boolean existsByUserIdAndProjectId(int userId, int projectId);

	List<ProjectMember> findByUserId(int userId);

	@Modifying
	@Transactional
	@Query("DELETE FROM ProjectMember p WHERE p.userId = :userId")
	void deleteByUserId(@Param("userId") int userId);
}
