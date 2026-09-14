package com.backend.api_gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> {})
                .authorizeExchange(exchange -> exchange
                        // Let CORS preflight finish before authentication is evaluated.
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers(
                                "/",
                                "/login/**",
                                "/oauth2/**",
                                "/api/oauth2/**",
                                "/api/profiles/**",
                                "/api/skills/**",
                                "/api/browse/**",
                                "/uploads/**"
                        ).permitAll()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt -> {})
                )
                .build();
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    /**
     * Both the gateway and a directly reachable downstream service add CORS
     * headers. A proxied response can therefore contain duplicate values,
     * which browsers reject as a CORS error even when the request succeeded.
     */
    @Bean
    public GlobalFilter deduplicateCorsResponseHeaders() {
        return (exchange, chain) -> {
            exchange.getResponse().beforeCommit(() -> {
                HttpHeaders headers = exchange.getResponse().getHeaders();
                keepFirstHeaderValue(headers, HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN);
                keepFirstHeaderValue(headers, HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS);
                keepFirstHeaderValue(headers, HttpHeaders.VARY);
                return Mono.empty();
            });
            return chain.filter(exchange);
        };
    }

    private void keepFirstHeaderValue(HttpHeaders headers, String headerName) {
        String firstValue = headers.getFirst(headerName);
        if (firstValue != null) {
            headers.set(headerName, firstValue);
        }
    }
}
