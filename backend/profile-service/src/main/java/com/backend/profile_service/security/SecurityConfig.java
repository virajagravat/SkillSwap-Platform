package com.backend.profile_service.security;

import com.backend.profile_service.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer; // Spring Security 6
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;



/**
 * Spring‑Security configuration for **Profile‑service**.
 * - CORS is enabled via WebConfig (already present).
 * - CSRF disabled – we are completely stateless.
 * - Public endpoints: "/", "/login/**", "/oauth2/**", "/api/oauth2/**".
 * - Every other request must be authenticated by a valid JWT.
 * - The custom `JwtAuthenticationFilter` runs before Spring's username/password filter.
 */
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS (delegated to WebConfig)
            .cors(Customizer.withDefaults())
            // Stateless API → CSRF unnecessary
            .csrf(csrf -> csrf.disable())
            // No HTTP session – every request contains its own JWT
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // URL authorisation
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()          // pre‑flight
                    .requestMatchers("/", "/login/**", "/oauth2/**", "/api/oauth2/**", "/uploads/**")
                        .permitAll()                                                // public
                    .requestMatchers("/api/profiles/**").authenticated()
                    .anyRequest().authenticated())                                 // everything else
            // Register our JWT filter before the default authentication filter
            .addFilterBefore(jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
