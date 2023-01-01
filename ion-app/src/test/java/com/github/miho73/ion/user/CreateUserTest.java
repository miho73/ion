package com.github.miho73.ion.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class CreateUserTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @DisplayName("Create user with valid form")
    @Test
    void createUserValid() throws Exception {
        Map<String, Object> request = Map.of(
                "name", "test-acc",
                "grade", 1,
                "classroom", 4,
                "studentCode", 14,
                "id", "TestAcc",
                "password", "qwerty"
        );
        mockMvc.perform(
                        post("/auth/api/user/create")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(content().contentType("application/json"))
                .andDo(print());
    }

    @DisplayName("Create user with invalid form")
    @Test
    void createUserInvalid() throws Exception {
        Map<String, Object> request = Map.of(
                "name", "test-acc",
                "grade", 14,
                "classroom", 4,
                "studentCode", 14,
                "id", "TestAccId",
                "password", "qwerty"
        );
        mockMvc.perform(
                       post("/auth/api/user/create")
                               .contentType(MediaType.APPLICATION_JSON)
                               .content(objectMapper.writeValueAsString(request))
               )
               .andExpect(status().isBadRequest())
               .andExpect(content().contentType("application/json"))
               .andExpect(jsonPath("$.reason", is("form validation failure: grade")))
               .andDo(print());;
    }
}
