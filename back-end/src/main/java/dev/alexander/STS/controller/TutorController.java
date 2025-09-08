package dev.alexander.STS.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import dev.alexander.STS.entity.ResearchTopic;
import dev.alexander.STS.entity.Tutor;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.security.AccessCodes;
import dev.alexander.STS.service.TutorService;
import dev.alexander.STS.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/sts/tutor")
@RequiredArgsConstructor
public class TutorController {

    private final UserService userService;
    private final TutorService tutorService;

    @GetMapping("/{id}/topics")
    public ResponseEntity<List<ResearchTopic>> getTutorTopics(@PathVariable int id) {
        List<ResearchTopic> topics = tutorService.getResearchTopicsForTutor(id);
        return ResponseEntity.ok(topics);  
    }

    @GetMapping("/me")
    public ResponseEntity<?> getTutorProfile(Authentication auth) {
        User user = (User) auth.getPrincipal();

        return tutorService.getTutorByUserId(user.getId())
        .map(tutor -> {
            Map<String, Object> res = new java.util.HashMap<>();
            res.put("tutorId", tutor.getId());
            res.put("title", tutor.getTitle());
            res.put("department", tutor.getDepartment());
            res.put("officeNumber", tutor.getOfficeNumber());

         boolean profileComplete = tutor.getTitle() != null && !tutor.getTitle().isEmpty()
                && tutor.getDepartment() != null && !tutor.getDepartment().isEmpty()
                && tutor.getOfficeNumber() != null;
        res.put("profileComplete", profileComplete);

        return ResponseEntity.ok(res);
    })
    .orElseGet(() -> {
        Map<String, Object> res = new java.util.HashMap<>();
        res.put("tutorId", null);
        res.put("title", null);
        res.put("department", null);
        res.put("officeNumber", null);
        res.put("profileComplete", false);
        return ResponseEntity.ok(res);
    });
}

    @PostMapping("/setup")
    public ResponseEntity<?> setupTutor(@RequestBody TutorRegisterRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        User user = (User) auth.getPrincipal();

        if (!AccessCodes.TUTOR_CODE.equals(request.getAccessCode())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid access code.");
        }

        Tutor tutor = tutorService.getTutorByUserId(user.getId())
                .orElse(new Tutor());

        tutor.setUser(user);
        tutor.setTitle(request.getTitle());
        tutor.setDepartment(request.getDepartment());
        tutor.setOfficeNumber(request.getOfficeNumber());

        tutor.getResearchTopics().clear();

        for (ResearchTopicRequest dto : request.getTopics()) {
            ResearchTopic topic = new ResearchTopic();
            topic.setName(dto.getName());
            topic.setTopic(dto.getTopic());
            tutor.addResearchTopic(topic);
        }

        tutorService.saveTutor(tutor);

        return ResponseEntity.ok("Tutor profile saved successfully.");
    }
}