package dev.alexander.STS.repos;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.alexander.STS.entity.Thesis;

@Repository
public interface ThesisRepository extends JpaRepository<Thesis, Integer> {
    Optional<Thesis> findByStudentId(int studentId);
}