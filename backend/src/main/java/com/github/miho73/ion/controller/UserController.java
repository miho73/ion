package com.github.miho73.ion.controller;

import com.github.miho73.ion.dto.RecaptchaReply;
import com.github.miho73.ion.dto.User;
import com.github.miho73.ion.exceptions.IonException;
import com.github.miho73.ion.service.auth.RecaptchaService;
import com.github.miho73.ion.service.auth.SessionService;
import com.github.miho73.ion.service.ionid.UserService;
import com.github.miho73.ion.utils.RestResponse;
import com.github.miho73.ion.utils.Validation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user/api")
public class UserController {

  final
  UserService userService;

  final
  PasswordEncoder passwordEncoder;

  final
  SessionService sessionService;

  final
  RecaptchaService reCaptchaAssessment;

  @Value("${ion.recaptcha.block-threshold}")
  float CAPTCHA_THRESHOLD;

  public UserController(UserService userService, PasswordEncoder passwordEncoder, SessionService sessionService, RecaptchaService reCaptchaAssessment) {
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
    this.sessionService = sessionService;
    this.reCaptchaAssessment = reCaptchaAssessment;
  }

  @GetMapping(
    value = "/validation/id-duplication",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String checkIdDuplication(@RequestParam(name = "id") String id) {
    boolean ok = userService.existsUserById(id);
    log.info("id duplication check. id=" + id + ", result=" + ok);
    return RestResponse.restResponse(HttpStatus.OK, ok ? 0 : 1);
  }

  /**
   * 0 : success
   * 1 : insufficient parameter
   * 2 : invalid parameter(s)
   * 3 : captcha failed
   * 4 : too low captcha score
   */
  @PostMapping(
    value = "/create",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String createUser(
    @RequestBody Map<String, String> body,
    HttpServletResponse response
  ) {
    if (!Validation.checkKeys(body, "clas", "ctoken", "grade", "id", "name", "pwd", "scode")) {
      response.setStatus(400);
      log.error("create user failed: insufficient parameter");
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 1);
    }

    User user = new User();
    user.setGrade(Integer.parseInt(body.get("grade")));
    user.setClas(Integer.parseInt(body.get("clas")));
    user.setScode(Integer.parseInt(body.get("scode")));
    user.setPwd(body.get("pwd"));
    user.setId(body.get("id"));
    user.setName(body.get("name"));

    if (user.getGrade() == 0 || user.getScode() == 0 || user.getClas() == 0) {
      response.setStatus(400);
      log.error("create user failed: invalid parameter(s)");
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    }

    try {
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(body.get("ctoken"), "signup", false);
      if (!recaptchaReply.isOk()) {
        response.setStatus(400);
        log.warn("create user failed: captcha failed");
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
      }
      if (recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        response.setStatus(400);
        log.warn("create user failed: too low captcha score");
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
      }
    } catch (IOException e) {
      log.error("recaptcha failed(IOException).", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 3);
    }

    user.setPwd(passwordEncoder.encode(user.getPwd()));
    User created = userService.createUser(user);
    log.info("user created. uid=" + created.getUid() + ", id=" + created.getId());
    response.setStatus(201);
    return RestResponse.restResponse(HttpStatus.CREATED, created.getId());
  }

  @GetMapping(
    value = "/idx-iden",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String getIdxIden(
    HttpSession session
  ) {
    if (!sessionService.isLoggedIn(session)) {
      return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
    }

    JSONObject ret = new JSONObject();
    ret.put("name", sessionService.getName(session));
    ret.put("id", sessionService.getId(session));
    ret.put("priv", sessionService.getPrivilege(session));
    return RestResponse.restResponse(HttpStatus.OK, ret);
  }

  /**
   * data: success
   * 1: not in change mode
   */
  @GetMapping(
    value = "/scode-change/query",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String queryScodeChange(HttpSession session, HttpServletResponse response) {
    Object sco = session.getAttribute("schange");
    if (sco == null) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 1);
    }
    boolean sc = (boolean) sco;
    if (!sc) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 1);
    } else return RestResponse.restResponse(HttpStatus.OK, session.getAttribute("grade"));
  }

  /**
   * 0: success
   * 1: insufficient parameters
   * 2: recaptcha failed
   * 3: too low recaptcha score
   * 4: user not exists
   * 5: user is not in change mode
   * 6: internal server error
   */
  @PatchMapping(
    value = "/scode-change/change",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String changeScode(
    HttpSession session,
    HttpServletResponse response,
    @RequestBody Map<String, String> body) {
    if (Validation.checkKeys(body, "clas, scode, ctoken")) {
      response.setStatus(400);
      log.error("change scode failed: insufficient parameter");
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 1);
    }

    try {
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(body.get("ctoken"), "update_scode", false);
      if (!recaptchaReply.isOk()) {
        response.setStatus(400);
        log.warn("change scode failed: captcha failed");
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
      }

      if (recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        response.setStatus(400);
        log.warn("change scode failed: too low captcha score");
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
      }

      int ret = userService.updateScode(
        session,
        Integer.parseInt(body.get("clas")),
        Integer.parseInt(body.get("scode")),
        recaptchaReply.getAssessmentName()
      );
      if (ret != 0) {
        response.setStatus(400);
        log.error("change scode failed. reason=" + (ret == 4 ? "user not found" : "not in scode change state") + ", uid=" + sessionService.getUid(session));
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, ret);
      } else {
        log.info("scode changed. uid=" + sessionService.getUid(session));
        return RestResponse.restResponse(HttpStatus.OK, ret);
      }
    } catch (IOException e) {
      log.error("recaptcha failed(IOException).", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 6);
    } catch (IonException e) {
      log.error("uid not specified in session", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 6);
    }
  }

  /**
   * [data]: success
   * 1: invalid session
   * 2: user not found
   * 3: internal server error
   */
  @GetMapping(
    value = "/profile/get",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String getUserInfo(HttpSession session, HttpServletResponse response) {
    if (!sessionService.isLoggedIn(session)) {
      return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
    }

    try {
      JSONObject ret = userService.getUserInfo(sessionService.getUid(session));
      if (ret == null) {
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
      }
      return RestResponse.restResponse(HttpStatus.OK, ret);
    } catch (IonException e) {
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 1);
    }
  }
}
