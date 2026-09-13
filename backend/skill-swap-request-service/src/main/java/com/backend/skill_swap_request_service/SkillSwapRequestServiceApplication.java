package com.backend.skill_swap_request_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;



@SpringBootApplication
@EnableFeignClients(basePackages = "com.backend.skill_swap_request_service.client")
public class SkillSwapRequestServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkillSwapRequestServiceApplication.class, args);
	}

}
