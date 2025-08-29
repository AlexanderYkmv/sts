package dev.alexander.STS.repos;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.alexander.STS.entity.Tutor;
import dev.alexander.STS.entity.User;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, Integer> {    
    Optional<Tutor> findByUserId(int userId);
    boolean existsByUser(User user);
}