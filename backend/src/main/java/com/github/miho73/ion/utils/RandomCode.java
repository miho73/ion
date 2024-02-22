package com.github.miho73.ion.utils;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.Vector;

@Component
public class RandomCode {
  private final String CHARSET = "ABCDEFGHIZKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private final List<String> WORD_SET = new Vector<>();
  private int WORD_SET_SIZE;

  @PostConstruct
  public void init() throws IOException {
    InputStream resource = new ClassPathResource("wordlist.csv").getInputStream();
    String words = new String(resource.readAllBytes(), StandardCharsets.UTF_8);
    String[] wordArr = words.split(",");
    Collections.addAll(WORD_SET, wordArr);
    WORD_SET_SIZE = WORD_SET.size();
  }


  public String randomString(int len) {
    Random random = new Random();
    StringBuilder buffer = new StringBuilder(len);
    for (int i = 0; i < len; i++) {
      int pos = random.nextInt(0, 62);
      buffer.append(CHARSET.charAt(pos));
    }
    return buffer.toString();
  }

  public String certString() {
    StringBuilder buffer = new StringBuilder();
    for (int i = 0; i < 2; i++) {
      buffer.append(WORD_SET.get(new Random().nextInt(0, WORD_SET_SIZE)));
      if (i == 0) buffer.append("-");
    }
    return buffer.toString();
  }
}
