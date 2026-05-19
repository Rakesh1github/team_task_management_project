package com.ethara.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin("*")
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "<html><body style='font-family: sans-serif; text-align: center; padding-top: 100px; background-color: #0f172a; color: #f8fafc;'>" +
               "<div style='max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(167, 139, 250, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.5);'>" +
               "<h1 style='color: #a78bfa; margin-bottom: 20px;'>🚀 Team Task Manager Backend is Live!</h1>" +
               "<p style='color: #94a3b8; font-size: 18px; line-height: 1.6;'>The Spring Boot server is running successfully on Railway and is securely connected to your MongoDB Atlas cloud cluster.</p>" +
               "<div style='margin-top: 30px; display: inline-block; padding: 8px 16px; background: rgba(167, 139, 250, 0.1); border-radius: 20px; border: 1px solid rgba(167, 139, 250, 0.3); color: #c084fc; font-size: 14px; font-weight: 600;'>System Status: ACTIVE</div>" +
               "</div>" +
               "</body></html>";
    }
}
