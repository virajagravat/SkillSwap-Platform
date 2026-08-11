package com.backend.auth_service.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/api/oauth2")
public class OAuth2StartController {

    @GetMapping("/register/google")
    public void registerWithGoogle(HttpServletResponse response) throws IOException {
        setAuthModeCookie(response, "register");
        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/login/google")
    public void loginWithGoogle(HttpServletResponse response) throws IOException {
        setAuthModeCookie(response, "login");
        response.sendRedirect("/oauth2/authorization/google");
    }

    private void setAuthModeCookie(HttpServletResponse response, String mode) {
        Cookie cookie = new Cookie("skillswap_auth_mode", mode);
        cookie.setPath("/");
        cookie.setMaxAge(300);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);
    }
}
