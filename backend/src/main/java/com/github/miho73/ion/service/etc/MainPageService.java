package com.github.miho73.ion.service.etc;

import com.github.miho73.ion.utils.Requests;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@Slf4j
public class MainPageService {
  LocalDate pictureDate;
  JSONObject image;
  JSONObject fallBack = new JSONObject();

  @Value("${ion.apod.api-key}")
  String APOD_KEY;

  @PostConstruct
  public void init() {
    pictureDate = LocalDate.of(2000, 1, 1);
    fallBack.put("url", "https://apod.nasa.gov/apod/image/2103/M87bhPolarized_Eht_3414.jpg");
    fallBack.put("title", "M87: The First Black Hole Image");
    fallBack.put("type", "image");
    fallBack.put("exp", "What does a black hole look like? To find out, radio telescopes from around the Earth coordinated observations of black holes with the largest known event horizons on the sky.  Alone, black holes are just black, but these monster attractors are known to be surrounded by glowing gas.  This first image resolves the area around the black hole at the center of galaxy M87 on a scale below that expected for its event horizon.  Pictured, the dark central region is not the event horizon, but rather the black hole's shadow -- the central region of emitting gas darkened by the central black hole's gravity. The size and shape of the shadow is determined by bright gas near the event horizon, by strong gravitational lensing deflections, and by the black hole's spin.  In resolving this black hole's shadow, the Event Horizon Telescope (EHT) bolstered evidence that Einstein's gravity works even in extreme regions, and gave clear evidence that M87 has a central spinning black hole of about 6 billion solar masses.  Since releasing this featured image in 2019, the EHT has expanded to include more telescopes, observe more black holes, track polarized light,and is working to observe the immediately vicinity of the black hole in the center of our Milky Way Galaxy.    This week is: Black Hole Week  New EHT Results to be Announced: Next Thursday");
    fallBack.put("cpy", "");
  }

  public JSONObject getImage() {
    if (pictureDate.equals(LocalDate.now())) {
      return image;
    }

    log.info("updating APOD for " + pictureDate + " to " + LocalDate.now());
    try {
      String res = Requests.sendGetRequest("https://api.nasa.gov/planetary/apod?thumbs=true&api_key=" + APOD_KEY);
      JSONObject r = new JSONObject(res);
      JSONObject k = new JSONObject();
      k.put("url", r.get("hdurl"));
      k.put("type", r.get("media_type"));
      k.put("title", r.get("title"));
      k.put("exp", r.get("explanation"));
      k.put("cpy", r.has("copyright") ? r.get("copyright") : "");
      image = k;
      pictureDate = LocalDate.now();
      log.info("updated APOD for " + pictureDate);
      return image;
    } catch (Exception e) {
      log.error("Failed to update APOD picture", e);
      return fallBack;
    }
  }
}
