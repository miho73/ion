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
public class MealFeatureTest {
    @Autowired
    MockMvc mvc;

    @Test
    @DisplayName("API request to meal data should return a JSONObject with meal data")
    public void getMealAPITest() throws Exception {
        mvc.perform(get("/etc/api/meal"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("API request to meal data should return a JSONObject with PROPER meal data")
    public void getMealProperAPITest() throws Exception {
        mvc.perform(
                get("/etc/api/meal")
                )
                .andExpect(status().isOk())
                .andExpectAll(
                        jsonPath("$.result.ok").value(true),
                        jsonPath("$.result.data").isNotEmpty(),
                        jsonPath("$.result.data").isArray(),

                        jsonPath("$.result.data[0].time").value("조식"),
                        jsonPath("$.result.data[0].meal").isNotEmpty(),
                        jsonPath("$.result.data[0].calo").isNotEmpty(),
                        jsonPath("$.result.data[0].nutr").isNotEmpty(),

                        jsonPath("$.result.data[1].time").value("중식"),
                        jsonPath("$.result.data[1].meal").isNotEmpty(),
                        jsonPath("$.result.data[1].calo").isNotEmpty(),
                        jsonPath("$.result.data[1].nutr").isNotEmpty(),

                        jsonPath("$.result.data[2].time").value("석식"),
                        jsonPath("$.result.data[2].meal").isNotEmpty(),
                        jsonPath("$.result.data[2].calo").isNotEmpty(),
                        jsonPath("$.result.data[2].nutr").isNotEmpty()
                )
                .andReturn();
    }
}
