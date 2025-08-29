package dev.alexander.STS.service;

import java.util.List;
import org.springframework.stereotype.Service;
import dev.alexander.STS.entity.Feedback;
import dev.alexander.STS.repos.FeedbackRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Override
    public Feedback saveFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedback> getFeedbackForThesis(int thesisId) {
        return feedbackRepository.findByThesisId(thesisId);
    }
}