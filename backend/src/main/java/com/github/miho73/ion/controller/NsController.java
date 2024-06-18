package com.github.miho73.ion.controller;

import com.github.miho73.ion.dto.LnsReservation;
import com.github.miho73.ion.dto.NsRecord;
import com.github.miho73.ion.dto.RecaptchaReply;
import com.github.miho73.ion.exceptions.IonException;
import com.github.miho73.ion.service.auth.RecaptchaService;
import com.github.miho73.ion.service.auth.SessionService;
import com.github.miho73.ion.service.ns.NsService;
import com.github.miho73.ion.utils.RestResponse;
import com.github.miho73.ion.utils.Validation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/ns/api")
public class NsController {
  final
  SessionService sessionService;

  final
  NsService nsService;

  final
  RecaptchaService recaptchaService;

  @Value("${ion.recaptcha.block-threshold}")
  float CAPTCHA_THRESHOLD;

  DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");

  public NsController(SessionService sessionService, NsService nsService, RecaptchaService recaptchaService) {
    this.sessionService = sessionService;
    this.nsService = nsService;
    this.recaptchaService = recaptchaService;
  }

  /**
   * [data]: success
   * 1: invalid session
   */
  @GetMapping(
    value = "/nsr/get",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String getNsRecord(
    HttpSession session,
    HttpServletResponse response
  ) {
    if (!sessionService.checkPrivilege(session, SessionService.USER_PRIVILEGE)) {
      response.setStatus(401);
      return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
    }

    try {
      JSONArray ret = nsService.getNsList(sessionService.getUid(session));

      JSONObject reply = new JSONObject();
      reply.put("reqs", ret);
      reply.put("name", sessionService.getName(session));
      reply.put("id", sessionService.getId(session));
      reply.put("grade", sessionService.getGrade(session));
      reply.put("date", LocalDate.now().format(dtf));
      reply.put("preset", nsService.getTimePreset());

      return RestResponse.restResponse(HttpStatus.OK, reply);
    } catch (IonException e) {
      response.setStatus(401);
      log.warn("invalid session (to get nsr). unauthorized");
      return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
    }
  }

  /**
   * 0: success
   * 1: internal server error
   * 2: insufficient parameters
   * 3: invalid session
   * 4: user already requested
   * 5: seat already reserved
   * 6: recaptcha failed
   * 7: too low recaptcha score
   * 8: you are faculty
   * 9: invalid time for current preset
   */
  @PostMapping(
    value = "/nsr/create",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String createNsRequest(
    HttpSession session,
    HttpServletResponse response,
    @RequestBody Map<String, String> body
  ) {
    if (!sessionService.checkPrivilege(session, SessionService.USER_PRIVILEGE)) {
      response.setStatus(401);
      log.warn("invalid session (to create ns). unauthorized");
      return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 3);
    }

    // check key
    if (!Validation.checkKeys(body, "time", "supervisor", "reason", "place", "lnsReq", "lnsSeat", "ctoken")) {
      response.setStatus(400);
      log.error("insufficient parameters (to create ns)");
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    }

    try {
      RecaptchaReply reply = recaptchaService.performAssessment(body.get("ctoken"), "create_ns", false);
      if (!reply.isOk()) {
        response.setStatus(400);
        log.warn("failed to create ns request recaptcha failed");
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 6);
      }
      if (reply.getScore() <= CAPTCHA_THRESHOLD) {
        response.setStatus(400);
        log.warn("failed to create ns request: too low recaptcha score");
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 7);
      }

      // if user is registered is a faculty
      if (sessionService.getGrade(session) == 0) {
        response.setStatus(400);
        log.error("failed to create ns request: faculty. uid=" + sessionService.getId(session));
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 8);
      }

      int time = Integer.parseInt(body.get("time"));

      if (nsService.timePreset == NsService.TIMETABLE_TEMPLATE.NS3) {
        if (time != 0 && time != 1 && time != 2) {
          response.setStatus(400);
          log.error("failed to create ns request: invalid time for current preset. uid=" + sessionService.getId(session));
          return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 9);
        }
      } else if (nsService.timePreset == NsService.TIMETABLE_TEMPLATE.NS4) {
        if (time != 3 && time != 4 && time != 5 && time != 6) {
          response.setStatus(400);
          log.error("failed to create ns request: invalid time for current preset. uid=" + sessionService.getId(session));
          return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 9);
        }
      }

      int uuid = sessionService.getUid(session);
      NsRecord.NS_TIME nsTime = NsRecord.intToNsTime(time);

      // if user already has request on same time
      if (nsService.existsNsByUuid(uuid, nsTime)) {
        response.setStatus(400);
        log.warn("ns already requested. uuid=" + uuid + ", time=" + nsTime);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
      }

      boolean lnsReq = Boolean.parseBoolean(body.get("lnsReq"));

      NsRecord createdNs = nsService.saveNsRequest(uuid, nsTime, lnsReq, body);

      if (lnsReq) {
        int grade = sessionService.getGrade(session);
        LnsReservation lnsRev = nsService.saveLnsReservation(uuid, nsTime, grade, body.get("lnsSeat"), createdNs.getUid());
        if (lnsRev == null) {
          response.setStatus(400);
          log.error("Lns reservation failed: already reserved. uuid=" + uuid + ", time=" + nsTime + ", seat=" + body.get("lnsSeat"));
          return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 5);
        }
      }

      recaptchaService.addAssessmentComment(reply.getAssessmentName(), true);

      log.info("created ns req uuid=" + uuid + ", time=" + nsTime);
      response.setStatus(201);
      return RestResponse.restResponse(HttpStatus.CREATED, 0);
    } catch (IonException e) {
      response.setStatus(500);
      log.error("internal server error", e);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 1);
    } catch (IOException e) {
      response.setStatus(400);
      log.error("IOException", e);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 6);
    }
  }

  /**
   * 0: success
   * 1: invalid session
   * 2: no request on that time
   * 3: recaptcha failed
   * 4: too low recaptcha score
   */
  @DeleteMapping(
    value = "/nsr/delete",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String deleteNs(
    HttpSession session,
    HttpServletResponse response,
    @RequestParam("time") int timeInt,
    @RequestParam("ctoken") String captchaToken
  ) {
    if (!sessionService.checkPrivilege(session, SessionService.USER_PRIVILEGE)) {
      response.setStatus(401);
      log.warn("failed to delete ns: invalid session. unauthorized");
      return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
    }

    try {
      RecaptchaReply reply = recaptchaService.performAssessment(captchaToken, "delete_ns", false);
      if (!reply.isOk()) {
        response.setStatus(400);
        log.warn("failed to delete ns: recaptcha failed");
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
      }
      if (reply.getScore() <= CAPTCHA_THRESHOLD) {
        response.setStatus(400);
        log.warn("failed to delete ns: too low recaptcha score");
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
      }

      int uuid = sessionService.getUid(session);

      NsRecord.NS_TIME time = NsRecord.intToNsTime(timeInt);

      if (nsService.existsNsByUuid(uuid, time)) {
        nsService.deleteNs(uuid, time);
        log.info("deleted ns req uuid=" + uuid + ", time=" + time);
        return RestResponse.restResponse(HttpStatus.OK, 0);
      } else {
        response.setStatus(400);
        log.error("failed to delete ns: no request on that time. uuid=" + uuid + ", time=" + time);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
      }
    } catch (IonException e) {
      response.setStatus(400);
      log.error("Internal server error", e);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    } catch (IOException e) {
      response.setStatus(400);
      log.error("IOException", e);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
    }
  }

  /**
   * [data]: success
   * 1: invalid session
   */
  @GetMapping(
    value = "/lns/get",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String getLnsSeatState(
    HttpSession session,
    HttpServletResponse response
  ) {
    if (!sessionService.checkPrivilege(session, SessionService.USER_PRIVILEGE)) {
      response.setStatus(401);
      return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
    }

    JSONArray ist = nsService.getLnsSeat(sessionService.getGrade(session));
    return RestResponse.restResponse(HttpStatus.OK, ist);
  }

  /**
   * [data]: success
   * 1: invalid session
   */
  @GetMapping(
    value = "/lns-idx",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String getLnsSeatAtIndex(
    HttpSession session,
    HttpServletResponse response
  ) {
    if (!sessionService.checkPrivilege(session, SessionService.USER_PRIVILEGE)) {
      response.setStatus(401);
      return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
    }

    JSONObject body = new JSONObject();
    JSONArray ist = nsService.getLnsSeatRemaining(sessionService.getGrade(session) == 0 ? 2 : sessionService.getGrade(session));
    body.put("seats", ist);
    body.put("preset", nsService.getTimePreset());
    return RestResponse.restResponse(HttpStatus.OK, body);
  }
}
