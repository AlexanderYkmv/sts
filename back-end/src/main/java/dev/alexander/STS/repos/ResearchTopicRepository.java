package dev.alexander.STS.repos;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.alexander.STS.entity.ResearchTopic;

@Repository
public interface ResearchTopicRepository extends JpaRepository<ResearchTopic, Integer> {
    List<ResearchTopic> findByTutorId(int tutorId);
}