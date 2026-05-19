package com.ethara.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertCallback;
import org.springframework.stereotype.Component;

import com.ethara.Service.SequenceGeneratorService;
import com.ethara.entity.Attendance;
import com.ethara.entity.EmployeeActivity;
import com.ethara.entity.Project;
import com.ethara.entity.ProjectMember;
import com.ethara.entity.Task;
import com.ethara.entity.User;

@Component
public class EntityIdGeneratorCallback implements BeforeConvertCallback<Object> {

    @Autowired
    @Lazy
    private SequenceGeneratorService sequenceGenerator;

    @Override
    public Object onBeforeConvert(Object entity, String collection) {
        if (entity instanceof User) {
            User user = (User) entity;
            if (user.getId() == null || user.getId() == 0) {
                user.setId(sequenceGenerator.generateSequence(User.class.getSimpleName() + "_sequence"));
            }
        } else if (entity instanceof Attendance) {
            Attendance attendance = (Attendance) entity;
            if (attendance.getId() == null || attendance.getId() == 0) {
                attendance.setId(sequenceGenerator.generateSequence(Attendance.class.getSimpleName() + "_sequence"));
            }
        } else if (entity instanceof EmployeeActivity) {
            EmployeeActivity activity = (EmployeeActivity) entity;
            if (activity.getId() == null || activity.getId() == 0) {
                activity.setId(sequenceGenerator.generateSequence(EmployeeActivity.class.getSimpleName() + "_sequence"));
            }
        } else if (entity instanceof Project) {
            Project project = (Project) entity;
            if (project.getId() == null || project.getId() == 0) {
                project.setId(sequenceGenerator.generateSequence(Project.class.getSimpleName() + "_sequence"));
            }
        } else if (entity instanceof ProjectMember) {
            ProjectMember member = (ProjectMember) entity;
            if (member.getId() == null || member.getId() == 0) {
                member.setId(sequenceGenerator.generateSequence(ProjectMember.class.getSimpleName() + "_sequence"));
            }
        } else if (entity instanceof Task) {
            Task task = (Task) entity;
            if (task.getId() == null || task.getId() == 0) {
                task.setId(sequenceGenerator.generateSequence(Task.class.getSimpleName() + "_sequence"));
            }
        }
        return entity;
    }
}
