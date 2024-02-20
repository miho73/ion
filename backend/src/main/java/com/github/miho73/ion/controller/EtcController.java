package com.github.miho73.ion.controller;

import com.github.miho73.ion.service.etc.MealService;
import com.github.miho73.ion.service.etc.TemperatureService;
import com.github.miho73.ion.utils.RestResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/etc/api")
public class EtcController {
    final
    TemperatureService tempService;

    final
    MealService mealService;

    public EtcController(TemperatureService tempService, MealService mealService) {
        this.tempService = tempService;
        this.mealService = mealService;
    }

    @GetMapping(
        value = "/temp/hangang",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String getHangang() {
        return RestResponse.restResponse(HttpStatus.OK, tempService.getHanGangTemp());
    }

    @GetMapping(
        value = "/temp/incheon",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String getIncheon() {
        return RestResponse.restResponse(HttpStatus.OK, tempService.getIncheonTemp());
    }

    @GetMapping(
        value = "/meal",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String getMeal() {
        return RestResponse.restResponse(HttpStatus.OK, mealService.get());
    }
}
