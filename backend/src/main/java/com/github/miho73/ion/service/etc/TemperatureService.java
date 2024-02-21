package com.github.miho73.ion.service.etc;

import com.github.miho73.ion.exceptions.IonException;
import com.github.miho73.ion.utils.Requests;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

@Service
@Slf4j
public class TemperatureService {
  int uHourSeoul;
  int uHourIcn;
  JSONObject seoul;
  JSONObject icn;
  JSONObject fallBack;

  @Value("${ion.temperature.seoul-api-key}")
  String SEOUL_KEY;
  @Value("${ion.temperature.incheon-api-key}")
  String ICN_KEY;

  @PostConstruct
  public void init() {
    fallBack = new JSONObject();
    fallBack.put("ok", false);
    uHourIcn = -1;
    uHourSeoul = -1;
  }

  public JSONObject getHanGangTemp() {
    Date date = new Date();
    Calendar calendar = GregorianCalendar.getInstance();
    calendar.setTime(date);
    int ch = calendar.get(Calendar.HOUR_OF_DAY);
    if (uHourSeoul == ch) return seoul;
    else {
      try {
        String jsn = Requests.sendGetRequest("http://openapi.seoul.go.kr:8088/" + SEOUL_KEY + "/json/WPOSInformationTime/1/5/");
        JSONObject r = new JSONObject(jsn);
        JSONObject res = r.getJSONObject("WPOSInformationTime");
        if (!res.getJSONObject("RESULT").getString("CODE").equals("INFO-000")) {
          throw new IonException();
        }
        JSONObject data = res.getJSONArray("row").getJSONObject(1);
        JSONObject k = new JSONObject();
        k.put("ok", true);
        k.put("loc", "중량천");
        k.put("dat", data.getString("MSR_DATE").substring(4, 8));
        k.put("tim", data.getString("MSR_TIME"));
        k.put("tem", data.getString("W_TEMP"));
        seoul = k;
        uHourSeoul = ch;
        log.info("Updated temperature of Hangang. Loc=" + ch + ", Rem=" + k.get("dat") + "/" + k.get("tim"));
        return seoul;
      } catch (IOException | JSONException | IonException e) {
        log.error("Failed to update Hangang temperature", e);
        return fallBack;
      }
    }
  }

  DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

  public JSONObject getIncheonTemp() {
    Date date = new Date();
    Calendar calendar = GregorianCalendar.getInstance();
    calendar.setTime(date);
    int ch = calendar.get(Calendar.HOUR_OF_DAY);
    if (uHourIcn == ch) return icn;
    else {
      try {
        String mx = Integer.toString(calendar.get(Calendar.MONTH) + 1), da = Integer.toString(calendar.get(Calendar.DAY_OF_MONTH));
        if (mx.length() == 1) mx = "0" + mx;
        if (da.length() == 1) da = "0" + da;

        String jsn = Requests.sendGetRequest("http://www.khoa.go.kr/api/oceangrid/tideObsTemp/search.do?ServiceKey=" + ICN_KEY + "&ObsCode=DT_0001&Date=" + calendar.get(Calendar.YEAR) + mx + da + "&ResultType=json");
        JSONObject r = new JSONObject(jsn);
        JSONObject res = r.getJSONObject("result");
        JSONArray data = res.getJSONArray("data");
        JSONObject e = data.getJSONObject(data.length() - 1);
        JSONObject k = new JSONObject();

        LocalDateTime dateTime = LocalDateTime.parse(e.getString("record_time"), formatter);
        String mon = Integer.toString(dateTime.getMonthValue());
        if (mon.length() == 1) mon = "0" + mon;
        k.put("ok", true);
        k.put("loc", "인천 조위관측소");
        k.put("dat", mon + dateTime.getDayOfMonth());
        k.put("tim", Integer.toString(dateTime.getHour()));
        k.put("tem", e.get("water_temp"));
        icn = k;
        uHourIcn = ch;
        log.info("Updated temperature of Incheon. Loc=" + ch + ", Rem=" + k.get("dat") + "/" + k.get("tim"));
        return icn;
      } catch (IOException | JSONException e) {
        log.error("Failed to update Incheon temperature", e);
        return fallBack;
      }
    }
  }
}
