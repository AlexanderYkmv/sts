package dev.alexander.STS.service;

import dev.alexander.STS.entity.Feedback;

import java.util.List;

public interface FeedbackService {
    Feedback saveFeedback(Feedback feedback);

    List<Feedback> getFeedbackForThesis(int thesisId);

    Feedback createFeedback(int thesisId, String content, dev.alexander.STS.entity.User author);
}
