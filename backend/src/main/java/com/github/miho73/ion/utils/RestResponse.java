package com.github.miho73.ion.utils;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class RestResponse {
    public static String restResponse(HttpStatus status, Object result) {
        JSONObject res = new JSONObject();
        res.put("status", status.value());
        res.put("result", result);
        return res.toString();
    }

    public static String restResponse(HttpStatus status) {
        JSONObject res = new JSONObject();
        res.put("status", status.value());
        return res.toString();
    }
}