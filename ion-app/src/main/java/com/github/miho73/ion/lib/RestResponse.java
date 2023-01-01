package com.github.miho73.ion.lib;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class RestResponse {
    public static ResponseEntity<Map<String, Object>> createRest(Map<String, Object> body, HttpStatus status) {
        HttpHeaders headers = new HttpHeaders();
        Map<String, Object> newMap = new HashMap<>(body);
        newMap.put("code", Integer.valueOf(status.value()));
        newMap.put("message", status.toString());
        return new ResponseEntity<>(newMap, headers, status);
    }
}
