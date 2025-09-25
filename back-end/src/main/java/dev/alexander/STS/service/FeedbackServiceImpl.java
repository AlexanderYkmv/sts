package dev.alexander.STS.service;

import dev.alexander.STS.entity.Feedback;
import dev.alexander.STS.entity.Thesis;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.repos.FeedbackRepository;
import dev.alexander.STS.repos.ThesisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ThesisRepository thesisRepository;

    @Override
    public Feedback saveFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedback> getFeedbackForThesis(int thesisId) {
        return feedbackRepository.findByThesisId(thesisId);
    }

    @Override
    public Feedback createFeedback(int thesisId, String content, User author) {
        Thesis thesis = thesisRepository.findById(thesisId)
                .orElseThrow(() -> new RuntimeException("Thesis not found"));

        Feedback feedback = new Feedback();
        feedback.setThesis(thesis);
        feedback.setAuthor(author);
        feedback.setContent(content);
        feedback.setCreatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }
}
