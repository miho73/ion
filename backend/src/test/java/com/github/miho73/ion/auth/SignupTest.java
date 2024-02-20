package com.github.miho73.ion.auth;

import com.github.miho73.ion.dto.User;
import com.github.miho73.ion.repository.UserRepository;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Timestamp;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
public class SignupTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    UserRepository userRepository;

    private User user;
    private JSONObject userJson;

    @Before
    public void setup() {
        user = new User();
        user.setId("testuserid");
        user.setName("testusername");
        user.setPwd("testpassword");
        user.setGrade(1);
        user.setClas(1);
        user.setScode(4);
        user.setStatus(User.USER_STATUS.INACTIVATED);
        user.setJoinDate(new Timestamp(System.currentTimeMillis()));
        user.setPrivilege(1);

        userJson = new JSONObject();
        userJson.put("id", user.getId());
        userJson.put("name", user.getName());
        userJson.put("pwd", user.getPwd());
        userJson.put("grade", user.getGrade());
        userJson.put("clas", user.getClas());
        userJson.put("scode", user.getScode());
        userJson.put("ctoken", "bypass");
    }

    @Test
    @DisplayName("Create user test")
    public void createUser() throws Exception {
        mockMvc.perform(
                get("/user/api/validation/id-duplication")
                    .param("id", "testuserid")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.result").value(0))
            .andDo(firstDuplCheckResult -> {
                mockMvc.perform(
                        post("/user/api/create")
                            .content(userJson.toString())
                            .contentType(MediaType.APPLICATION_JSON_VALUE)
                    )
                    .andExpect(status().isCreated())
                    .andExpectAll(
                        jsonPath("$.result").isNotEmpty(),
                        jsonPath("$.result").isString(),
                        jsonPath("$.result").value(user.getId())
                    )
                    .andDo(createResult -> {
                        mockMvc.perform(
                                get("/user/api/validation/id-duplication")
                                    .param("id", user.getId())
                            )
                            .andExpect(status().isOk())
                            .andExpect(jsonPath("$.result").value(1))
                            .andReturn();
                    })
                    .andReturn();
            })
            .andReturn();
    }

    @After
    public void cleanup() {
        userRepository.deleteById(user.getId());
    }
}
