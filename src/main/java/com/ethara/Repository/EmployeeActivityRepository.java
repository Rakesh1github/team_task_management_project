package com.ethara.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ethara.entity.EmployeeActivity;

import jakarta.transaction.Transactional;

@Repository
public interface EmployeeActivityRepository extends JpaRepository<EmployeeActivity, Long> {
    
    List<EmployeeActivity> findByUserIdOrderByTimestampDesc(int userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM EmployeeActivity a WHERE a.userId = :userId")
    void deleteByUserId(@Param("userId") int userId);
}
