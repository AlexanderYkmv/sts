package dev.alexander.STS.controller;

import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import dev.alexander.STS.entity.Student;
import dev.alexander.STS.entity.Thesis;
import dev.alexander.STS.entity.User;
import dev.alexander.STS.service.StudentService;
import dev.alexander.STS.service.ThesisService;
import dev.alexander.STS.service.UserService;

@Controller
public class PageController {
    

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private ThesisService thesisService;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @GetMapping("/sts/student/setup")
    public String studentSetupPage() {
            return "student_setup";
        }

    @GetMapping("/sts/student/dashboard")
    public String studentDashboard(Model model, Principal principal) {
        User user = userService.getUserByEmail(principal.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        Student student = studentService.getStudentByUserId(user.getId()).orElse(null);
        model.addAttribute("student", student);

        Thesis thesis = thesisService.getThesisByStudentId(student.getId()).orElse(null);
        model.addAttribute("thesis", thesis);

        return "student_dashboard";
    }
    @GetMapping("/sts/tutor/setup")
    public String tutorSetupPage() {
            return "tutor_setup";
        }

    @GetMapping("/sts/tutor/dashboard")
    public String tutorDashboardPage() {
            System.out.println("Accessing tutor dashboard...");
            return "tutor_dashboard";
        }
}

