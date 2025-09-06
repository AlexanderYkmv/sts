package dev.alexander.STS.dto;

import dev.alexander.STS.entity.Thesis;
import lombok.Data;

@Data
public class ThesisDto {
    private int id;
    private String title;
    private String major;
    private String fileName;
    private Thesis.ThesisStatus status;
    private SimpleUserDto approvedBy;

    public ThesisDto(Thesis thesis) {
        this.id = thesis.getId();
        this.title = thesis.getTitle();
        this.major = thesis.getMajor();
        this.fileName = thesis.getFileName();
        this.status = thesis.getStatus();
        if (thesis.getApprovedBy() != null) {
            this.approvedBy = new SimpleUserDto(thesis.getApprovedBy());
        }
    }
}