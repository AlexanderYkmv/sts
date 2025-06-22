package dev.alexander.STS.controller;

import lombok.Data;

@Data
public class StudentRegisterRequest {
    
    private String facultyNumber;
    private String major;
    private Integer tutorId;
}
