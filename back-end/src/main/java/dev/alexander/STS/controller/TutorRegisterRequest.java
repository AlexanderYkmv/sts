package dev.alexander.STS.controller;

import java.util.List;
import lombok.Data;

@Data
public class TutorRegisterRequest {
    private int userId;
    private String title;
    private String department;
    private int officeNumber;
    private List<ResearchTopicRequest> topics;
    private String accessCode;
}
