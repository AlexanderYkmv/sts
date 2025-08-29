package dev.alexander.STS.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.repos.StudentRepository;
import dev.alexander.STS.repos.UserRepository;
import dev.alexander.STS.service.TutorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import dev.alexander.STS.entity.Student;
import dev.alexander.STS.entity.Tutor;

@RestController
@RequestMapping("/sts/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired 
    private TutorService tutorService;

    @Autowired
    private StudentRepository studentRepository;
    
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/test")
    public ResponseEntity<?> testSession(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        return ResponseEntity.ok("Logged in as: " + authentication.getName());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletRequest servletRequest) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }

        // Create user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole()); // enum: Student, Tutor, Vice_Dean
        userRepository.save(user);

        // Auto-create role-specific profile
        switch (user.getRole()) {
            case Student -> {
                var student = new Student();
                student.setUser(user);
                student.setFacultyNumber(null); // optional, fill later
                student.setMajor(null);
                studentRepository.save(student);
            }
            case Tutor -> {
                var tutor = new Tutor();
                tutor.setUser(user);
                tutor.setTitle(null); // optional
                tutorService.saveTutor(tutor);
            }
            case Vice_Dean -> {
                // no extra table needed right now
            }
        }

        // Auto-login
        var authToken = new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword());
        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        HttpSession session = servletRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext());
        session.setAttribute("userId", user.getId());

        // Build response with consistent absolute redirects
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        response.put("role", user.getRole());

        switch (user.getRole()) {
            case Student -> response.put("redirect", "/sts/student/dashboard");
            case Tutor -> response.put("redirect", "/sts/tutor/dashboard");
            case Vice_Dean -> response.put("redirect", "/vice-dean/dashboard");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String email = body.get("email");
        String password = body.get("password");

        try {
            var authRequest = new UsernamePasswordAuthenticationToken(email, password);
            Authentication authentication = authenticationManager.authenticate(authRequest);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext());

            User user = (User) authentication.getPrincipal();
            session.setAttribute("userId", user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("role", user.getRole());

            // Redirects: absolute paths
            switch (user.getRole()) {
                case Student -> {
                    boolean studentExists = studentRepository.existsByUser(user);
                    response.put("redirect", studentExists ? "/sts/student/dashboard" : "/sts/student/dashboard");
                    // since we now auto-create, both branches go to dashboard
                }
                case Tutor -> {
                    boolean tutorExists = tutorService.existsByUser(user);
                    response.put("redirect", tutorExists ? "/sts/tutor/dashboard" : "/sts/tutor/dashboard");
                }
                case Vice_Dean -> response.put("redirect", "/vice-dean/dashboard");
            }

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}
