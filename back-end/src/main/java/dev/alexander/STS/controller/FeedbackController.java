package dev.alexander.STS.controller;

import dev.alexander.STS.dto.FeedbackDto;
import dev.alexander.STS.entity.Feedback;
import dev.alexander.STS.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sts/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping("/thesis/{thesisId}")
    public ResponseEntity<List<FeedbackDto>> getFeedbackByThesis(@PathVariable int thesisId) {
        List<Feedback> feedbacks = feedbackService.getFeedbackForThesis(thesisId);
        List<FeedbackDto> dtos = feedbacks.stream()
                .map(FeedbackDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}