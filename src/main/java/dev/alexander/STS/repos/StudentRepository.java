package dev.alexander.STS.repos;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import dev.alexander.STS.entity.Student;
import dev.alexander.STS.entity.User;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByUserId(int userId);
    boolean existsByUser(User user);
}