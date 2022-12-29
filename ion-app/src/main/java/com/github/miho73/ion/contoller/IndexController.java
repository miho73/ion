package com.github.miho73.ion.contoller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller("IndexController")
public class IndexController {
    @GetMapping("/")
    public String indexControl(Model model) {
        return "index";
    }
}
