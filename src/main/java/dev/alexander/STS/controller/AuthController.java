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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

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

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword());
        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        HttpSession session = servletRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                            SecurityContextHolder.getContext());

        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        switch (user.getRole()) {
            case Student:
                response.put("redirect", "sts/student/setup");
                break;
            case Tutor:
                response.put("redirect", "sts/tutor/setup");
                break;
            case Vice_Dean:
                response.put("redirect", "/vice-dean/dashboard");
                break;
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String email = body.get("email");
        String password = body.get("password");

        try {
            UsernamePasswordAuthenticationToken authRequest =
                new UsernamePasswordAuthenticationToken(email, password);

            Authentication authentication = authenticationManager.authenticate(authRequest);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                     SecurityContextHolder.getContext());

            User user = (User) authentication.getPrincipal();

            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("role", user.getRole());
            
            if (user.getRole() == User.Role.Student) {

                boolean studentExists = studentRepository.existsByUser(user);
                if (studentExists) {
                    response.put("redirect", "sts/student/dashboard");
                } else {
                    response.put("redirect", "sts/student/setup");
                }
            } else if (user.getRole() == User.Role.Tutor) {
                response.put("redirect", "sts/tutor/setup");
            } else if (user.getRole() == User.Role.Vice_Dean) {
                response.put("redirect", "/vice-dean/dashboard");
            }

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}
