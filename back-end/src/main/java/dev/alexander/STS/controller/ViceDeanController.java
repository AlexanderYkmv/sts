package dev.alexander.STS.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.alexander.STS.entity.Thesis;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.service.ThesisService;
import dev.alexander.STS.service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RestController
@RequestMapping("/sts/vice-dean")
@RequiredArgsConstructor
public class ViceDeanController {

    private final UserService userService;
    private final ThesisService thesisService;

    @PostMapping("/setup")
    public ResponseEntity<?> setupViceDean(@RequestBody ViceDeanRegisterRequest request) {
        Optional<User> userOpt = userService.getUserById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        if (user.getRole() != User.Role.Vice_Dean) {
            return ResponseEntity.badRequest().body("User is not a Vice Dean");
        }

        return ResponseEntity.ok("Vice Dean profile setup complete");
    }

    @GetMapping("/theses")
    public ResponseEntity<List<ThesisDto>> getAllTheses() {
        List<Thesis> theses = thesisService.getAllTheses();
        List<ThesisDto> dtoList = theses.stream().map(ThesisDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/thesis/decision")
    public ResponseEntity<?> decideOnThesis(@RequestBody ThesisReviewRequest request) {
        Optional<Thesis> thesisOpt = thesisService.getThesisById(request.getThesisId());
        Optional<User> viceDeanOpt = userService.getUserById(request.getViceDeanId());

        if (thesisOpt.isEmpty() || viceDeanOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid thesis or user ID");
        }

        User viceDean = viceDeanOpt.get();
        if (viceDean.getRole() != User.Role.Vice_Dean) {
            return ResponseEntity.badRequest().body("User is not a Vice Dean");
        }

        Thesis thesis = thesisOpt.get();

        try {
            Thesis.ThesisStatus status =
                    Thesis.ThesisStatus.valueOf(request.getStatus().toUpperCase());
            thesisService.reviewThesis(thesis, status, viceDean);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid thesis status");
        }

        return ResponseEntity.ok("Thesis reviewed with status: " + request.getStatus());
    }

    @Getter
    @Setter
    public static class ThesisDto {
        private int id;
        private String title;
        private String major;
        private String status;
        private String studentName;

        public ThesisDto(Thesis thesis) {
            this.id = thesis.getId();
            this.title = thesis.getTitle();
            this.major = thesis.getMajor();
            this.status = thesis.getStatus().name();

            if (thesis.getStudent() != null && thesis.getStudent().getUser() != null) {
                User u = thesis.getStudent().getUser();
                this.studentName = (u.getFirstName() != null ? u.getFirstName() : "") + " "
                        + (u.getLastName() != null ? u.getLastName() : "");
            } else {
                this.studentName = "—";
            }
        }
    }
}
