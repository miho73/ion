package com.github.miho73.ion.controller;

import com.github.miho73.ion.service.etc.MainPageService;
import com.github.miho73.ion.utils.RestResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

@Controller
@Slf4j
public class MainController {
    final
    MainPageService mainPageService;

    public MainController(MainPageService mainPageService) {
        this.mainPageService = mainPageService;
    }

    @GetMapping({
            "/",
            "/auth/signup", "/auth/iforgot", "/auth/iforgot/reset",
            "/docs/**",
            "/ns",
            "/manage",
            "/etc/temperature/hangang", "/etc/temperature/incheon",
            "/etc/meal",
            "/profile"
    })
    public String index() {
        return "index";
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleResourceNotFoundException(HttpServletRequest request) {
        return "index";
    }

    @GetMapping(
            value = "/idx/apod",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public String getApodNasa() {
        return RestResponse.restResponse(HttpStatus.OK, mainPageService.getImage());
    }
}
