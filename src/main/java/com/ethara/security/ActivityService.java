package com.ethara.security;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.ethara.Repository.EmployeeActivityRepository;
import com.ethara.entity.EmployeeActivity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final EmployeeActivityRepository activityRepository;

    public void logActivity(int userId, String actionType, String description) {
        EmployeeActivity activity = new EmployeeActivity();
        activity.setUserId(userId);
        activity.setActionType(actionType);
        activity.setDescription(description);
        activity.setTimestamp(LocalDateTime.now());
        activityRepository.save(activity);
    }
}
