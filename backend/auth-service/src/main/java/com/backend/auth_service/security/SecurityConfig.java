package com.backend.auth_service.security;

import com.backend.auth_service.security.jwt.JwtAuthenticationFilter;
import com.backend.auth_service.security.oauth.CustomOAuth2UserService;
import com.backend.auth_service.security.oauth.OAuth2LoginSuccessHandler;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;



@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler successHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // JWT based so that reason i will disable csrf.
            .csrf(csrf -> csrf.disable())

            // No Session-based authentication ,
            // JWT based stateless authentication
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // CORS preflight request
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

                // Public OAuth endpoints
                .requestMatchers(
                    "/",
                    "/login/**",
                    "/oauth2/**",
                    "/api/oauth2/**"
                )
                .permitAll()

                // other than all Apis have jwt mandatory 
                .anyRequest()
                .authenticated()
            )

            // Google OAuth2
            .oauth2Login(oauth -> oauth

                .userInfoEndpoint(userInfo ->
                    userInfo.userService(
                        customOAuth2UserService
                    )
                )

                .successHandler(successHandler)
            )


            // JWT filter
            .addFilterBefore(
                jwtAuthenticationFilter,
                org.springframework.security.web.authentication
                    .UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of(
                "http://localhost:5173",
                "http://localhost:5174"
            )
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of(
                "Authorization",
                "Content-Type"
            )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }
}
