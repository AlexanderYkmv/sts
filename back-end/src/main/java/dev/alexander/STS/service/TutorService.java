package dev.alexander.STS.service;

import java.util.List;
import java.util.Optional;
import dev.alexander.STS.entity.ResearchTopic;
import dev.alexander.STS.entity.Tutor;
import dev.alexander.STS.entity.User;

public interface TutorService {
    Tutor saveTutor(Tutor tutor);
    Optional<Tutor> getTutorByUserId(int userId);
    List<ResearchTopic> getResearchTopicsForTutor(int tutorId);
    boolean existsByUser(User user);
}