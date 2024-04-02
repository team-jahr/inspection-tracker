package org.jahr.backend.inspection.DTO;

import org.jahr.backend.area.model.Area;
import org.jahr.backend.inspection.model.Inspection;
import org.jahr.backend.inspectionIssue.model.InspectionIssue;
import org.jahr.backend.inspectionIssue.model.InspectionIssueKey;
import org.jahr.backend.location.model.Location;
import org.jahr.backend.user.model.AppUser;

import java.time.LocalDateTime;
import java.util.List;


public record InspectionDTO(Integer id, String description, boolean isSubmitted, LocalDateTime date,
                            Area area, Location location, String email, AppUser user,
                            List<InspectionIssueKey> inspectionIssueKeys) {


    public static InspectionDTO fromInspection(Inspection inspection) {
        List<InspectionIssueKey> keys =
                inspection.getInspectionIssues().stream().map(InspectionIssue::getId).toList();
        return new InspectionDTO(
                inspection.getId(),
                inspection.getDescription(),
                inspection.isSubmitted(),
                inspection.getDate(),
                inspection.getArea(),
                inspection.getArea().getLocation(),
                inspection.getReportedTo(),
                inspection.getAppUser(),
                keys
        );
    }

    public static Inspection toInspection(InspectionDTO dto) {
        return new Inspection(
                dto.description(),
                dto.date(),
                dto.isSubmitted(),
                dto.email(),
                dto.area(),
                dto.user()
        );
    }
}
