package com.github.miho73.ion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@SpringBootApplication
@EnableRedisHttpSession
public class IonAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(IonAppApplication.class, args);
    }

}
