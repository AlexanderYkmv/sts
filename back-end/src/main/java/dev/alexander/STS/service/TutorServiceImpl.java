package dev.alexander.STS.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import dev.alexander.STS.entity.ResearchTopic;
import dev.alexander.STS.entity.Tutor;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.repos.ResearchTopicRepository;
import dev.alexander.STS.repos.TutorRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;
    private final ResearchTopicRepository researchTopicRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<ResearchTopic> getResearchTopicsForTutor(int tutorId) {
        return researchTopicRepository.findByTutorId(tutorId);
    }

    @Override
    public boolean existsByUser(User user) {
        return tutorRepository.existsByUser(user);
    }

    @Override
    @Transactional
    public Tutor saveTutor(Tutor tutor) {

        if (tutor.getId() == 0 && tutor.getUser() != null) {
            tutor.setId(tutor.getUser().getId());
        }
        if (tutor.getResearchTopics() != null) {
            for (ResearchTopic topic : tutor.getResearchTopics()) {
                topic.setTutor(tutor);
            }
        }

        return tutorRepository.save(tutor);
    }

    @Override
    public Optional<Tutor> getTutorByUserId(int userId) {
        return tutorRepository.findByUserId(userId);
    }
}
