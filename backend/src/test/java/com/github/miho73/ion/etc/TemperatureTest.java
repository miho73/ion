package com.github.miho73.ion.etc;


import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
public class TemperatureTest {
  @Autowired
  MockMvc mvc;

  @Test
  @DisplayName("Get Hangang Temperature")
  public void getHangangTemp() throws Exception {
    mvc.perform(
        get("/etc/api/temp/hangang")
      )
      .andExpect(status().isOk())
      .andExpectAll(
        jsonPath("$.status").value(200),
        jsonPath("$.result.ok").value(true),
        jsonPath("$.result.dat").isNotEmpty(),
        jsonPath("$.result.loc").isNotEmpty(),
        jsonPath("$.result.tem").isNotEmpty(),
        jsonPath("$.result.tim").isNotEmpty()
      )
      .andReturn();
  }

  @Test
  @DisplayName("Get Incheon Temperature")
  public void getIncheonTemperature() throws Exception {
    mvc.perform(
        get("/etc/api/temp/incheon")
      )
      .andExpect(status().isOk())
      .andExpectAll(
        jsonPath("$.status").value(200),
        jsonPath("$.result.ok").value(true),
        jsonPath("$.result.dat").isNotEmpty(),
        jsonPath("$.result.loc").isNotEmpty(),
        jsonPath("$.result.tem").isNotEmpty(),
        jsonPath("$.result.tim").isNotEmpty()
      )
      .andReturn();
  }
}
