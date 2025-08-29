package dev.alexander.STS.service;

import java.util.List;
import java.util.Optional;
import dev.alexander.STS.entity.Student;

public interface StudentService {
    Student saveStudent(Student student);
    Optional<Student> getStudentById(int id);
    Optional<Student> getStudentByUserId(int userId);
    List<Student> getAllStudents();
    void deleteStudentById(int id);
}