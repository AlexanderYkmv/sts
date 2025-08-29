package dev.alexander.STS.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import dev.alexander.STS.entity.Student;
import dev.alexander.STS.repos.StudentRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public Optional<Student> getStudentById(int id) {
        return studentRepository.findById(id);
    }

    @Override
    public Optional<Student> getStudentByUserId(int userId) {
        return studentRepository.findByUserId(userId);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public void deleteStudentById(int id) {
        studentRepository.deleteById(id);
    }
}