package com.github.miho73.ion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Value("${ion.config.allow-cors-localhost}")
    boolean allowCorsLocalhost;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if(allowCorsLocalhost) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("OPTIONS", "GET", "POST", "PUT", "DELETE", "PATCH")
                    .allowCredentials(true);
        }
    }
}
