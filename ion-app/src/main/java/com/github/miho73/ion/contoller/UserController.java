package com.github.miho73.ion.contoller;

import com.github.miho73.ion.jpa.User;
import com.github.miho73.ion.lib.Assertion;
import com.github.miho73.ion.lib.RestResponse;
import com.github.miho73.ion.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Slf4j
@Controller("UserController")
@RequestMapping("/auth")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping(
            value = "/api/user/create",
            consumes = {MediaType.APPLICATION_JSON_VALUE}
    )
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        // Form Validation
        if(Assertion.rangeAssert(user.getName().length(), 2, 50)) {
            return RestResponse.createRest(Map.of(
                    "reason", "form validation failure: name"
            ), HttpStatus.BAD_REQUEST);
        }
        if(Assertion.rangeAssert(user.getGrade(), 1, 3)) {
            return RestResponse.createRest(Map.of(
                    "reason", "form validation failure: grade"
            ), HttpStatus.BAD_REQUEST);
        }
        if(Assertion.rangeAssert(user.getClassroom(), 1, 4)) {
            return RestResponse.createRest(Map.of(
                    "reason", "form validation failure: classroom"
            ), HttpStatus.BAD_REQUEST);
        }
        if(Assertion.rangeAssert(user.getStudentCode(), 1, 30)) {
            return RestResponse.createRest(Map.of(
                    "reason", "form validation failure: stuCode"
            ), HttpStatus.BAD_REQUEST);
        }
        if(Assertion.rangeAssert(user.getId().length(), 4, 30)) {
            return RestResponse.createRest(Map.of(
                    "reason", "form validation failure: id"
            ), HttpStatus.BAD_REQUEST);
        }
        if(Assertion.rangeAssert(user.getPassword().length(), 6, 50)) {
            return RestResponse.createRest(Map.of(
                    "reason", "form validation failure: password"
            ), HttpStatus.BAD_REQUEST);
        }

        // Create user
        if(userService.findUserById(user.getId())) {
            return RestResponse.createRest(Map.of(
                    "reason", "id already exists"
            ), HttpStatus.BAD_REQUEST);
        }
        userService.createUser(user);
        return RestResponse.createRest(Map.of(
                "result", "Fsk"
        ), HttpStatus.CREATED);
    }

    @PostMapping(
            value = "/api/user/id-preflight",
            consumes = {MediaType.TEXT_PLAIN_VALUE}
    )
    public ResponseEntity<Map<String, Object>> idValidation(@RequestBody String userId) {
        boolean ok = userService.findUserById(userId);
        return RestResponse.createRest(Map.of(
                "result", ok
        ), HttpStatus.OK);
    }
}
