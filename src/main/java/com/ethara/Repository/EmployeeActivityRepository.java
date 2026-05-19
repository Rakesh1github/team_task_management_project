package com.ethara.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ethara.entity.EmployeeActivity;

@Repository
public interface EmployeeActivityRepository extends MongoRepository<EmployeeActivity, Long> {
    
    List<EmployeeActivity> findByUserIdOrderByTimestampDesc(int userId);

    void deleteByUserId(int userId);
}
