package dev.alexander.STS.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.alexander.STS.entity.ResearchTopic;
import dev.alexander.STS.entity.Tutor;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.security.AccessCodes;
import dev.alexander.STS.service.TutorService;
import dev.alexander.STS.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sts/tutor")
@RequiredArgsConstructor
public class TutorController {

    private final UserService userService;
    private final TutorService tutorService;

    @GetMapping("/{id}/topics")
    public ResponseEntity<List<ResearchTopic>> getTutorTopics(@PathVariable int id) {
    List<ResearchTopic> topics = tutorService.getResearchTopicsForTutor(id);
        if (topics.isEmpty()) {        
        return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(topics);
    }

    @PostMapping("/setup")
    public ResponseEntity<?> setupTutor(@RequestBody TutorRegisterRequest request, HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

    Optional<User> userOpt = userService.getUserById(userId);
    if (userOpt.isEmpty()) {
        return ResponseEntity.badRequest().body("User not found");
    }

    if (!AccessCodes.TUTOR_CODE.equals(request.getAccessCode())) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid access code for tutor registration.");
    }

    User user = userOpt.get();

    Tutor tutor = new Tutor();
    tutor.setUser(user);
    tutor.setTitle(request.getTitle());
    tutor.setDepartment(request.getDepartment());
    tutor.setOfficeNumber(request.getOfficeNumber());

    Tutor savedTutor = tutorService.saveTutor(tutor);

    for (ResearchTopicRequest dto : request.getTopics()) {
        ResearchTopic topic = new ResearchTopic();
        topic.setName(dto.getName());
        topic.setTopic(dto.getTopic());
        savedTutor.addResearchTopic(topic);
    }

    tutorService.saveTutor(savedTutor);

    return ResponseEntity.ok("Tutor profile created successfully.");
}
}