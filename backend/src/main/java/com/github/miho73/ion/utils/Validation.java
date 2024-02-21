package com.github.miho73.ion.utils;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class Validation {
  public static boolean checkKeys(Map<String, String> body, String... toCheck) {
    for (String key : toCheck) {
      if (!body.containsKey(key)) return false;
      String e = body.get(key);
      if (e == null) return false;
    }
    return true;
  }
}
