package com.github.miho73.ion.contoller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Map;

@Slf4j
@Controller("ErrorPageController")
public class ErrorPageController implements ErrorController {
    @PostMapping("/error")
    public ResponseEntity<Map<String, Object>> handlePostError(HttpServletRequest request,
                                         HttpServletResponse response,
                                         Model model) {

        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        HttpStatus httpStatus = HttpStatus.valueOf(Integer.parseInt(status.toString()));
        if(httpStatus == HttpStatus.INTERNAL_SERVER_ERROR) {
            log.error("Internal Server Error reported to error page handler");
        }

        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<>(Map.of(
                "code", httpStatus.value(),
                "message", httpStatus.toString()
        ), headers, httpStatus);
    }

    @GetMapping("/error")
    public String handleGetError(HttpServletRequest request,
                              HttpServletResponse response,
                              Model model) {

        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        HttpStatus httpStatus = HttpStatus.valueOf(Integer.parseInt(status.toString()));
        if(httpStatus == HttpStatus.INTERNAL_SERVER_ERROR) {
            log.error("Internal Server Error reported to error page handler");
        }
        model.addAllAttributes(Map.of(
                "code", httpStatus.value(),
                "message", httpStatus.toString()
        ));

        return "plain/error";
    }
}
