
package com.backend.skill_swap_request_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/skill-swap-requests")
public class SkillSwapRequestController {

    @GetMapping("/test")
    public String test() {
        return "Skill Swap Request Service is working!";
    }
}