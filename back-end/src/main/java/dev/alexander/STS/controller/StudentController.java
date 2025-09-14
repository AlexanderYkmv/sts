package dev.alexander.STS.controller;

import java.security.Principal;
import java.util.Optional;

import dev.alexander.STS.entity.Student;
import dev.alexander.STS.entity.Tutor;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.entity.ResearchTopic;
import dev.alexander.STS.repos.StudentRepository;
import dev.alexander.STS.repos.TutorRepository;
import dev.alexander.STS.repos.UserRepository;
import dev.alexander.STS.repos.ResearchTopicRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sts/student")
@RequiredArgsConstructor
public class StudentController {

    private final UserRepository userRepository;
    private final TutorRepository tutorRepository;
    private final StudentRepository studentRepository;
    private final ResearchTopicRepository researchTopicRepository;

    // ---------------- Student Setup ----------------
    @PostMapping("/setup")
    @Transactional
    public ResponseEntity<?> setupStudent(@RequestBody StudentRegisterRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty() || userOpt.get().getRole() != User.Role.Student) {
            return ResponseEntity.badRequest().body("Invalid student.");
        }

        User user = userOpt.get();

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student entity not found"));

        student.setFacultyNumber(request.facultyNumber());
        student.setMajor(request.major());

        if (request.tutorId() != null) {
            Tutor tutor = tutorRepository.findById(request.tutorId())
                    .orElseThrow(() -> new RuntimeException("Tutor not found"));
            student.setTutor(tutor);
        }

        studentRepository.save(student);
        return ResponseEntity.ok("Student profile saved.");
    }

    // ---------------- Enroll in Research Topic ----------------
    @PostMapping("/enroll/{topicId}")
    @Transactional
    public ResponseEntity<?> enrollInTopic(@PathVariable int topicId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != User.Role.Student) {
            return ResponseEntity.status(403).body("Not a student");
        }

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        ResearchTopic topic = researchTopicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Research topic not found"));

        if (student.getResearchTopic() != null) {
            return ResponseEntity.badRequest().body("Student already enrolled in a topic");
        }

        if (topic.getAssignedStudents().size() >= topic.getCapacity()) {
            return ResponseEntity.badRequest().body("Topic is full");
        }

        // Enroll student
        student.setResearchTopic(topic);
        student.setTutor(topic.getTutor());
        studentRepository.save(student);

        return ResponseEntity.ok(new ResearchTopicResponse(topic.getId(), topic.getName(),
                topic.getTopic(), topic.getCapacity(), topic.getAssignedStudents().size(),
                topic.getTutor() != null ? topic.getTutor().getId() : null));
    }

    // ---------------- Get Current Student Profile ----------------
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentStudent(Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).body("Not authenticated");

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != User.Role.Student) {
            return ResponseEntity.status(403).body("Not a student");
        }

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        boolean profileComplete = student.getFacultyNumber() != null && student.getMajor() != null;

        Integer topicId =
                student.getResearchTopic() != null ? student.getResearchTopic().getId() : null;
        Integer tutorId = student.getTutor() != null ? student.getTutor().getId() : null;

        return ResponseEntity.ok(new StudentMeResponse(student.getId(), student.getMajor(),
                student.getFacultyNumber(), profileComplete, topicId, tutorId));
    }

    public record StudentRegisterRequest(String facultyNumber, String major, Integer tutorId) {
    }

    public record StudentMeResponse(int studentId, String major, String facultyNumber,
            boolean profileComplete, Integer researchTopicId, Integer tutorId) {
    }

    public record ResearchTopicResponse(int id, String name, String topic, int capacity,
            int assignedStudentsCount, Integer tutorId) {
    }
}
