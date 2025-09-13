package dev.alexander.STS.controller;

import java.util.List;
import lombok.Data;
import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import dev.alexander.STS.entity.ResearchTopic;
import dev.alexander.STS.entity.Tutor;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.security.AccessCodes;
import dev.alexander.STS.service.TutorService;
import dev.alexander.STS.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sts/tutor")
@RequiredArgsConstructor
public class TutorController {

    private final UserService userService;
    private final TutorService tutorService;

    @Data
    @AllArgsConstructor
    static class TutorProfileDTO {
        private Integer tutorId;
        private String title;
        private String department;
        private Integer officeNumber;
        private boolean profileComplete;
        private String role; // enum as string for frontend
    }

    @Data
    @AllArgsConstructor
    static class ResearchTopicDTO {
        private Integer id;
        private String name;
        private String topic;
        private Integer capacity;
        private Integer assignedStudentsCount;

        public ResearchTopicDTO(ResearchTopic rt) {
            this.id = rt.getId();
            this.name = rt.getName();
            this.topic = rt.getTopic();
            this.capacity = rt.getCapacity();
            this.assignedStudentsCount =
                    rt.getAssignedStudents() != null ? rt.getAssignedStudents().size() : 0;
        }
    }

    @Data
    @AllArgsConstructor
    static class TutorWithTopicsDTO {
        private Integer tutorId;
        private String title;
        private String department;
        private Integer officeNumber;
        private List<ResearchTopicDTO> topics;
    }

    // Get logged-in tutor profile
    @GetMapping("/me")
    public ResponseEntity<TutorProfileDTO> getTutorProfile(Authentication auth) {
        User user = (User) auth.getPrincipal();

        return tutorService.getTutorByUserId(user.getId()).map(tutor -> {
            boolean profileComplete = tutor.getTitle() != null && !tutor.getTitle().isEmpty()
                    && tutor.getDepartment() != null && !tutor.getDepartment().isEmpty()
                    && tutor.getOfficeNumber() != null;

            return ResponseEntity
                    .ok(new TutorProfileDTO(tutor.getId(), tutor.getTitle(), tutor.getDepartment(),
                            tutor.getOfficeNumber(), profileComplete, user.getRole().name()));
        }).orElseGet(() -> ResponseEntity
                .ok(new TutorProfileDTO(null, null, null, null, false, user.getRole().name())));
    }

    // Get topics for any tutor by ID
    @GetMapping("/{id}/topics")
    public ResponseEntity<List<ResearchTopic>> getTutorTopics(@PathVariable int id) {
        List<ResearchTopic> topics = tutorService.getResearchTopicsForTutor(id);
        return ResponseEntity.ok(topics);
    }

    // Get topics of logged-in tutor
    @GetMapping("/topics")
    public ResponseEntity<List<ResearchTopic>> getMyTopics(Authentication auth) {
        User user = (User) auth.getPrincipal();
        Tutor tutor = tutorService.getTutorByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        return ResponseEntity.ok(tutor.getResearchTopics());
    }

    // Setup tutor profile
    @PostMapping("/setup")
    @Transactional
    public ResponseEntity<?> setupTutor(@RequestBody TutorRegisterRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        User user = (User) auth.getPrincipal();

        if (!AccessCodes.TUTOR_CODE.equals(request.getAccessCode())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid access code.");
        }

        Tutor tutor = tutorService.getTutorByUserId(user.getId()).orElseGet(() -> {
            Tutor t = new Tutor();
            t.setUser(user);
            t.setId(user.getId());
            return t;
        });

        tutor.setTitle(request.getTitle());
        tutor.setDepartment(request.getDepartment());
        tutor.setOfficeNumber(request.getOfficeNumber());

        tutor.getResearchTopics().clear();

        if (request.getTopics() != null) {
            for (ResearchTopicRequest dto : request.getTopics()) {
                ResearchTopic topic = new ResearchTopic();
                topic.setName(dto.getName());
                topic.setTopic(dto.getTopic());
                topic.setCapacity(dto.getCapacity() != null ? dto.getCapacity() : 1);
                tutor.addResearchTopic(topic);
            }
        }

        tutorService.saveTutor(tutor);
        return ResponseEntity.ok("Tutor profile saved successfully.");
    }

    // Get all tutors with topics (with assigned student count)
    @GetMapping("/all")
    public ResponseEntity<List<TutorWithTopicsDTO>> getAllTutors() {
        List<Tutor> tutors = tutorService.getAllTutors();
        List<TutorWithTopicsDTO> dto = tutors.stream().map(t -> {
            List<ResearchTopicDTO> topics =
                    t.getResearchTopics().stream().map(ResearchTopicDTO::new).toList();
            return new TutorWithTopicsDTO(t.getId(), t.getTitle(), t.getDepartment(),
                    t.getOfficeNumber(), topics);
        }).toList();

        return ResponseEntity.ok(dto);
    }

    // Update tutor research topics
    @PostMapping("/topics")
    @Transactional
    public ResponseEntity<?> updateTopics(@RequestBody List<ResearchTopicRequest> topicsRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        User user = (User) auth.getPrincipal();
        Tutor tutor = tutorService.getTutorByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        tutor.getResearchTopics().clear();

        if (topicsRequest != null) {
            for (ResearchTopicRequest dto : topicsRequest) {
                ResearchTopic topic = new ResearchTopic();
                topic.setName(dto.getName());
                topic.setTopic(dto.getTopic());
                topic.setCapacity(dto.getCapacity() != null ? dto.getCapacity() : 1);
                tutor.addResearchTopic(topic);
            }
        }

        tutorService.saveTutor(tutor);
        return ResponseEntity.ok("Research topics updated successfully.");
    }
}
