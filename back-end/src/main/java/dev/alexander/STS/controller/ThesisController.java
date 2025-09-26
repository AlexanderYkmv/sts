package dev.alexander.STS.controller;

import dev.alexander.STS.dto.FeedbackDto;
import dev.alexander.STS.dto.ThesisDto;
import dev.alexander.STS.entity.Feedback;
import dev.alexander.STS.entity.Thesis;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.service.FeedbackService;
import dev.alexander.STS.service.StudentService;
import dev.alexander.STS.service.ThesisService;
import dev.alexander.STS.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import dev.alexander.STS.entity.Student;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sts/thesis")
@RequiredArgsConstructor
public class ThesisController {

    private final ThesisService thesisService;
    private final StudentService studentService;
    private final UserService userService;
    private final FeedbackService feedbackService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadThesis(@RequestParam("studentId") int studentId,
            @RequestParam("title") String title, @RequestParam("major") String major,
            @RequestParam("file") MultipartFile file) throws IOException {

        Optional<Student> studentOpt = studentService.getStudentById(studentId);
        if (studentOpt.isEmpty())
            return ResponseEntity.badRequest().body("Student not found");

        Thesis thesis = new Thesis();
        thesis.setStudent(studentOpt.get());
        thesis.setTitle(title);
        thesis.setMajor(major);
        thesis.setFileName(file.getOriginalFilename());
        thesis.setFileData(file.getBytes());
        thesis.setStatus(Thesis.ThesisStatus.PENDING);

        thesisService.saveThesis(thesis);
        return ResponseEntity.ok("Thesis uploaded successfully.");
    }

    // preview thesis content
    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> getThesisFile(@PathVariable int id) {
        Optional<Thesis> thesisOpt = thesisService.getThesisById(id);
        if (thesisOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Thesis thesis = thesisOpt.get();
        if (thesis.getFileData() == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = "application/octet-stream";
        if (thesis.getFileName() != null && thesis.getFileName().toLowerCase().endsWith(".pdf")) {
            contentType = "application/pdf";
        } else if (thesis.getFileName() != null
                && thesis.getFileName().toLowerCase().endsWith(".docx")) {
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=\"" + thesis.getFileName() + "\"")
                .header("Content-Type", contentType).body(thesis.getFileData());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getThesisByStudent(@PathVariable int studentId) {
        Optional<Thesis> thesisOpt = thesisService.getThesisByStudentId(studentId);
        return thesisOpt.map(t -> ResponseEntity.ok(new ThesisDto(t)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/feedbacks")
    public ResponseEntity<List<FeedbackDto>> getFeedbacks(@PathVariable int id) {
        List<Feedback> feedbacks = feedbackService.getFeedbackForThesis(id);
        List<FeedbackDto> dtos =
                feedbacks.stream().map(FeedbackDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<?> reviewThesis(@PathVariable int id,
            @RequestBody ThesisReviewRequest request) {
        Optional<Thesis> thesisOpt = thesisService.getThesisById(id);
        Optional<User> viceDeanOpt = userService.getUserById(request.getViceDeanId());

        if (thesisOpt.isEmpty() || viceDeanOpt.isEmpty())
            return ResponseEntity.badRequest().body("Thesis or Vice Dean not found");

        Thesis thesis = thesisOpt.get();

        try {
            Thesis.ThesisStatus status =
                    Thesis.ThesisStatus.valueOf(request.getStatus().toUpperCase());
            thesis.setStatus(status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid thesis status");
        }

        thesis.setApprovedBy(viceDeanOpt.get());

        Feedback feedback = new Feedback();
        feedback.setThesis(thesis);
        feedback.setAuthor(viceDeanOpt.get());
        feedback.setContent(request.getFeedback());
        feedback.setCreatedAt(LocalDateTime.now());

        feedbackService.saveFeedback(feedback);
        thesisService.saveThesis(thesis);

        return ResponseEntity.ok("Thesis reviewed.");
    }
}
