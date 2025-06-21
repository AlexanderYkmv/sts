package dev.alexander.STS.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import dev.alexander.STS.entity.Feedback;
import dev.alexander.STS.entity.Student;
import dev.alexander.STS.entity.Thesis;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.service.FeedbackService;
import dev.alexander.STS.service.StudentService;
import dev.alexander.STS.service.ThesisService;
import dev.alexander.STS.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sts/thesis")
@RequiredArgsConstructor
public class ThesisController {

    private final ThesisService thesisService;
    private final StudentService studentService;
    private final UserService userService;
    private final FeedbackService feedbackService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadThesis(
            @RequestParam("studentId") int studentId,
            @RequestParam("title") String title,
            @RequestParam("major") String major,
            @RequestParam("file") MultipartFile file) throws IOException {

        Optional<Student> studentOpt = studentService.getStudentById(studentId);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        Thesis thesis = new Thesis();
        thesis.setStudent(studentOpt.get());
        thesis.setTitle(title);
        thesis.setMajor(major);
        thesis.setFileData(file.getBytes());
        thesis.setStatus(Thesis.ThesisStatus.PENDING);

        thesisService.saveThesis(thesis);

        return ResponseEntity.ok("Thesis uploaded successfully.");
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> previewThesisFile(@PathVariable int id) {
        Optional<Thesis> thesisOpt = thesisService.getThesisById(id);
        if (thesisOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Thesis thesis = thesisOpt.get();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=thesis.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(thesis.getFileData());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Thesis>> getAllTheses() {
        return ResponseEntity.ok(thesisService.getAllTheses());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getThesisByStudentId(@PathVariable int studentId) {
        Optional<Thesis> thesisOpt = thesisService.getThesisByStudentId(studentId);
        return thesisOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
}

    @PostMapping("/{id}/review")
    public ResponseEntity<?> reviewThesis(@PathVariable int id, @RequestBody ThesisReviewRequest request) {
        Optional<Thesis> thesisOpt = thesisService.getThesisById(id);
        Optional<User> viceDeanOpt = userService.getUserById(request.getViceDeanId());

        if (thesisOpt.isEmpty() || viceDeanOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Thesis or Vice Dean not found");
        }

        Thesis thesis = thesisOpt.get();
        thesis.setStatus(request.getStatus());
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