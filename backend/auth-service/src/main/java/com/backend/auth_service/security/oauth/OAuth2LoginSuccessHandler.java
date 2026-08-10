package com.backend.auth_service.security.oauth;

import com.backend.auth_service.entity.AccountStatus;
import com.backend.auth_service.entity.Role;
import com.backend.auth_service.entity.User;
import com.backend.auth_service.repository.AccountStatusRepository;
import com.backend.auth_service.repository.RoleRepository;
import com.backend.auth_service.repository.UserRepository;
import com.backend.auth_service.security.jwt.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;


@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler{
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AccountStatusRepository accountStatusRepository;

    @Override
    @Transactional
    public void onAuthenticationSuccess( HttpServletRequest request,HttpServletResponse response,Authentication authentication) throws IOException,ServletException
    {
        // Google authenticated user
        OAuth2User oauth2User=  (OAuth2User) authentication.getPrincipal();
        
          // Google account email
        String googleId = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String fullName = oauth2User.getAttribute("name");
        String profilePicture = oauth2User.getAttribute("picture");
        String mode = getAuthMode(request);

        System.out.println("GOOGLE LOGIN SUCCESS");
        System.out.println("EMAIL : " + email);
        System.out.println("AUTH MODE : " + mode);

        User user = userRepository.findByEmail(email).orElse(null);

        if ("login".equals(mode) && user == null) {
            clearAuthModeCookie(response);
            redirectWithError(response, "User is not registered. Please register with Google first.");
            return;
        }

        if (user == null) {
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("User Role Not Found"));

            AccountStatus accountStatus = accountStatusRepository.findByName("ACTIVE")
                    .orElseThrow(() -> new RuntimeException("Active Status not Found"));

            user = new User();
            user.setEmail(email);
            user.setRole(userRole);
            user.setAccountStatus(accountStatus);
        }

        user.setGoogleId(googleId);
        user.setFullName(fullName);
        user.setProfilePicture(profilePicture);
        userRepository.save(user);

        // Generate our application's JWT
        String token = jwtService.generateToken(email);

        System.out.println("JWT GENERATED : " + token);
        clearAuthModeCookie(response);

        // Send JWT to React frontend
        response.sendRedirect(
                "http://localhost:5173/oauth-success?token=" + token
        );
    }

    private String getAuthMode(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return "login";
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> "skillswap_auth_mode".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse("login");
    }

    private void clearAuthModeCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("skillswap_auth_mode", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);
    }

    private void redirectWithError(HttpServletResponse response, String message) throws IOException {
        String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
        response.sendRedirect("http://localhost:5173/oauth-success?error=" + encodedMessage);
    }
}
