package dev.alexander.STS.service;

import java.util.List;
import java.util.Optional;
import dev.alexander.STS.entity.ResearchTopic;
import dev.alexander.STS.entity.Tutor;

public interface TutorService {
    Tutor saveTutor(Tutor tutor);
    Optional<Tutor> getTutorByUserId(int userId);
    List<ResearchTopic> getResearchTopicsForTutor(int tutorId);
}