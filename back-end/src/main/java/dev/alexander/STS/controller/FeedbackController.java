package dev.alexander.STS.controller;

import dev.alexander.STS.dto.FeedbackDto;
import dev.alexander.STS.entity.Feedback;
import dev.alexander.STS.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import dev.alexander.STS.entity.User;

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
        List<FeedbackDto> dtos =
                feedbacks.stream().map(FeedbackDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<FeedbackDto> postFeedback(@RequestBody FeedbackRequest request,
            Authentication auth) {
        if (auth == null || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        User author = (User) auth.getPrincipal();
        Feedback feedback =
                feedbackService.createFeedback(request.getThesisId(), request.getContent(), author);

        return ResponseEntity.ok(new FeedbackDto(feedback));
    }

    public static class FeedbackRequest {
        private int thesisId;
        private String content;

        public int getThesisId() {
            return thesisId;
        }

        public void setThesisId(int thesisId) {
            this.thesisId = thesisId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
