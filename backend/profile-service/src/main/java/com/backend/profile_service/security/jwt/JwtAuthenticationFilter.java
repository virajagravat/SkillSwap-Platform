package com.backend.profile_service.security.jwt;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtService jwtService;
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        // No token → simply continue (public endpoints will be allowed later)
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = header.substring(7);   // strip "Bearer "
        if (!jwtService.isTokenValid(token)) {
            log.warn("Invalid or expired JWT");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired JWT token");
            return;
        }
        // ---- 1️⃣ Extract email (subject) ----
        String email = jwtService.extractEmail(token);
        // ---- 2️⃣ Extract role claim (optional) ----
        String role = extractRoleFromToken(token);
        if (role == null) role = "USER";          // default role
        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(email, null, List.of(authority));
        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.info("Authenticated request – principal={}, authorities={}",
                email, authentication.getAuthorities());
        filterChain.doFilter(request, response);
    }
    /** Reads a custom claim named `role` (you can rename it to whatever you put in the JWT). */
    private String extractRoleFromToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(jwtService.getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("role", String.class);   // <-- change if your claim name differs
        } catch (Exception e) {
            // No role claim present – treat as null   (fallback to USER)
            return null;
        }
    }
}