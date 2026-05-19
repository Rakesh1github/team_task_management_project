package com.ethara.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ethara.entity.Attendance;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, Long> {

    Optional<Attendance> findByUserIdAndDate(int userId, LocalDate date);
    
    List<Attendance> findByDateBetween(LocalDate start, LocalDate end);
    
    List<Attendance> findByUserIdAndDateBetween(int userId, LocalDate start, LocalDate end);

    void deleteByUserId(int userId);
}
