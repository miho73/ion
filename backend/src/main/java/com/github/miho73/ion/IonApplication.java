package com.github.miho73.ion;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@SpringBootApplication
@EnableRedisHttpSession
@EnableEncryptableProperties
@EnableScheduling
@Slf4j
public class IonApplication {
  public static void main(String[] args) {
    log.info("Starting Ion...");
    SpringApplication.run(IonApplication.class, args);
  }
}
