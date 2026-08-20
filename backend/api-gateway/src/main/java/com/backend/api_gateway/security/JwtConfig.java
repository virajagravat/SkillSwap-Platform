package com.backend.api_gateway.security;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
@Configuration

public class JwtConfig {
    
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {

        SecretKey key = new SecretKeySpec(
                jwtSecret.getBytes(),
                "HmacSHA256"
        );

        return NimbusReactiveJwtDecoder
                .withSecretKey(key)
                .build();
    }

}
