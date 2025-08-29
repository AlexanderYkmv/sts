package dev.alexander.STS.controller;

import java.util.List;
import java.util.Optional;
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
import lombok.RequiredArgsConstructor;

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

    // get all theses
    @GetMapping("/theses")
    public ResponseEntity<List<Thesis>> getAllTheses() {
        return ResponseEntity.ok(thesisService.getAllTheses());
    }

    // thesis approval
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
        thesis.setStatus(request.getStatus());
        thesis.setApprovedBy(viceDean);
        thesisService.saveThesis(thesis);

        return ResponseEntity.ok("Thesis " + request.getStatus());
    }
}