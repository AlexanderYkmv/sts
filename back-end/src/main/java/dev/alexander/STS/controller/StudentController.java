package dev.alexander.STS.controller;

import java.security.Principal;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.alexander.STS.entity.Student;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.repos.StudentRepository;
import dev.alexander.STS.repos.TutorRepository;
import dev.alexander.STS.repos.UserRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sts/student")
@RequiredArgsConstructor
public class StudentController {

    private final UserRepository userRepository;
    private final TutorRepository tutorRepository;
    private final StudentRepository studentRepository;

    @PostMapping("/setup")
    public ResponseEntity<?> setupStudent(@RequestBody StudentRegisterRequest request, Principal principal) {
        String email = principal.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || userOpt.get().getRole() != User.Role.Student) {
            return ResponseEntity.badRequest().body("Invalid student ID.");
        }
        
        Student student = new Student();
        student.setUser(userOpt.get()); 
        student.setFacultyNumber(request.getFacultyNumber());
        student.setMajor(request.getMajor());

        if (request.getTutorId() != null) {
            tutorRepository.findById(request.getTutorId()).ifPresent(student::setTutor);
        }

        studentRepository.save(student);
        return ResponseEntity.ok("Student profile created.");
    }
}
