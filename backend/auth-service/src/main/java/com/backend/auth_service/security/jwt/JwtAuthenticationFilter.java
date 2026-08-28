package com.backend.auth_service.security.jwt;

import com.backend.auth_service.entity.User;
import com.backend.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Get Authorization header
        String authHeader = request.getHeader("Authorization");

        // If JWT is not present, continue request
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        String token = authHeader.substring(7);

        try {

            // Validate JWT
            if (jwtService.isTokenValid(token)) {

                // Extract email from JWT
                String email = jwtService.extractEmail(token);

                // Find user in Neon database (eagerly fetching the role)
                User user = userRepository.findByEmail(email)
                        .orElse(null);

                if (user != null &&
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null) {

                    // Convert database role into Spring Security authority
                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" + user.getRole().getName()
                            );

                    // Create authenticated user
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    List.of(authority)
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // Set authenticated user in SecurityContext
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                } else if (user == null) {
                    System.out.println("JWT Authentication failed: User not found in DB for email: '" + email + "'");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("JWT Authentication failed: User not found in DB for email: '" + email + "'");
                    return;
                }
            } else {
                System.out.println("JWT Authentication failed: Token is invalid");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("JWT Authentication failed: Token is invalid");
                return;
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT Authentication failed: "
                            + e.getMessage()
            );
            e.printStackTrace();
            
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("JWT Authentication failed: " + e.getMessage());
            return;
        }

        // Continue request
        filterChain.doFilter(request, response);
    }
}
