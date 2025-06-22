package dev.alexander.STS.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    
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
    public String studentDashboardPage() {
    System.out.println("Accessing student dashboard...");
    return "student_dashboard";  
}
}
