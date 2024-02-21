package com.github.miho73.ion.service.etc;

import com.github.miho73.ion.utils.Requests;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

@Service("mealService")
@Slf4j
public class MealService {
  @Value("${ion.neis.api-key}")
  String MEAL_KEY;

  JSONObject cache;
  JSONObject fallback;

  @PostConstruct
  public void init() {
    fallback = new JSONObject();
    fallback.put("ok", false);
    day = 0;
  }

  public JSONObject query(Calendar calendar) {
    try {
      String mx = Integer.toString(calendar.get(Calendar.MONTH) + 1), da = Integer.toString(calendar.get(Calendar.DAY_OF_MONTH));
      if (mx.length() == 1) mx = "0" + mx;
      if (da.length() == 1) da = "0" + da;

      String jsn = Requests.sendGetRequest("https://open.neis.go.kr/hub/mealServiceDietInfo?key=" + MEAL_KEY + "&type=json&pIndex=1&pSize=3&ATPT_OFCDC_SC_CODE=E10&SD_SCHUL_CODE=7310058&MLSV_YMD=" + calendar.get(Calendar.YEAR) + mx + da);
      JSONObject parsed = new JSONObject(jsn);

      //if meal data does not exists
      if (!parsed.has("mealServiceDietInfo")) {
        log.error("Meal data was not found. update failed");
        return fallback;
      }

      JSONArray reply = parsed.getJSONArray("mealServiceDietInfo").getJSONObject(1).getJSONArray("row");

      JSONArray ret = new JSONArray();
      reply.forEach(ex -> {
        JSONObject e = (JSONObject) ex;
        JSONObject element = new JSONObject();
        element.put("time", e.getString("MMEAL_SC_NM"));
        element.put("meal", e.getString("DDISH_NM"));
        element.put("calo", e.getString("CAL_INFO"));
        element.put("nutr", e.getString("NTR_INFO"));
        ret.put(element);
      });
      JSONObject rex = new JSONObject();
      rex.put("data", ret);
      rex.put("ok", true);
      log.info("Meal data was updated");
      return rex;
    } catch (IOException | JSONException e) {
      log.error("Failed to update meal", e);
      return fallback;
    }
  }

  int day;

  public JSONObject get() {
    Date date = new Date();
    Calendar calendar = GregorianCalendar.getInstance();
    calendar.setTime(date);
    if (day != calendar.get(Calendar.DAY_OF_MONTH)) {
      cache = query(calendar);
      day = calendar.get(Calendar.DAY_OF_MONTH);
    }
    return cache;
  }
}
