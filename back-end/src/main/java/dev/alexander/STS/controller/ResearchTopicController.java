package dev.alexander.STS.controller;

import java.util.Optional;

import dev.alexander.STS.entity.ResearchTopic;
import dev.alexander.STS.repos.ResearchTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sts/research-topic")
@RequiredArgsConstructor
public class ResearchTopicController {

    private final ResearchTopicRepository researchTopicRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getTopicById(@PathVariable int id) {
        Optional<ResearchTopic> topicOpt = researchTopicRepository.findById(id);
        if (topicOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Research topic not found");
        }

        ResearchTopic topic = topicOpt.get();

        var response = new Object() {
            public int id = topic.getId();
            public String name = topic.getName();
            public String topicDesc = topic.getTopic();
            public int capacity = topic.getCapacity();
            public int assignedStudentsCount = topic.getAssignedStudents().size();
        };

        return ResponseEntity.ok(response);
    }
}
