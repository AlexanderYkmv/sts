package dev.alexander.STS.service;

import java.util.List;
import dev.alexander.STS.entity.Feedback;

public interface FeedbackService {
    Feedback saveFeedback(Feedback feedback);
    List<Feedback> getFeedbackForThesis(int thesisId);
}