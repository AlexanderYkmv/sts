package dev.alexander.STS.controller;

import dev.alexander.STS.entity.Thesis;
import lombok.Data;

@Data
public class ThesisReviewRequest {
    private int thesisId;
    private int viceDeanId;
    private Thesis.ThesisStatus status;
    private String feedback;
}
