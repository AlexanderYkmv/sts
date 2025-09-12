package dev.alexander.STS.controller;

import lombok.Data;

@Data
public class ResearchTopicRequest {
    private String name;
    private String topic;
    private Integer capacity;
}
