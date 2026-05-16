package com.ethara.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ethara.entity.Attendance;

import jakarta.transaction.Transactional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByUserIdAndDate(int userId, LocalDate date);
    
    List<Attendance> findByDateBetween(LocalDate start, LocalDate end);
    
    List<Attendance> findByUserIdAndDateBetween(int userId, LocalDate start, LocalDate end);

    @Modifying
    @Transactional
    @Query("DELETE FROM Attendance a WHERE a.userId = :userId")
    void deleteByUserId(@Param("userId") int userId);
}
