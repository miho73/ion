package com.github.miho73.ion.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.miho73.ion.dto.RecaptchaReply;
import com.github.miho73.ion.dto.ResetPasswordReq;
import com.github.miho73.ion.dto.User;
import com.github.miho73.ion.exceptions.IonException;
import com.github.miho73.ion.service.auth.*;
import com.github.miho73.ion.service.ionid.UserService;
import com.github.miho73.ion.utils.RandomCode;
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
import java.sql.Timestamp;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/auth/api")
public class AuthController {
  final
  RandomCode randomCode;

  final
  PasswordEncoder passwordEncoder;

  final
  UserService userService;

  final
  AuthService authService;

  final
  SessionService sessionService;

  final
  ResetPasswordService resetPasswordService;

  final
  RecaptchaService reCaptchaAssessment;

  final PasskeyService passkeyService;

  @Value("${ion.recaptcha.block-threshold}")
  float CAPTCHA_THRESHOLD;

  public AuthController(PasswordEncoder passwordEncoder, UserService userService, AuthService authService, SessionService sessionService, ResetPasswordService resetPasswordService, RecaptchaService reCaptchaAssessment, RandomCode randomCode, PasskeyService passkeyService) {
    this.passwordEncoder = passwordEncoder;
    this.userService = userService;
    this.authService = authService;
    this.sessionService = sessionService;
    this.resetPasswordService = resetPasswordService;
    this.reCaptchaAssessment = reCaptchaAssessment;
    this.randomCode = randomCode;
    this.passkeyService = passkeyService;
  }

  /**
   * 0: ok.
   * 1: user not found.
   * 2: inactivated.
   * 3: banned.
   * 4: incorrect passcode
   * 5: recaptcha failed
   * 6: client recaptcha failed (low score)
   * 7: set to change scode mode
   */
  @PostMapping(
    value = "authenticate",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String performLogin(
    HttpServletResponse response,
    @RequestBody Map<String, String> body,
    HttpSession session
  ) {
    if (!Validation.checkKeys(body, "id", "pwd", "ctoken", "checkbox")) {
      response.setStatus(400);
      log.error("login failed: insufficient parameter(s).");
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST);
    }

    boolean isCheckboxMode = Boolean.parseBoolean(body.get("checkbox"));

    Optional<User> userOptional;
    try {
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(body.get("ctoken"), "login", isCheckboxMode);
      if (!recaptchaReply.isOk()) {
        log.warn("login failed: recaptcha failed. id=" + body.get("id"));
        return RestResponse.restResponse(HttpStatus.OK, 6);
      }

      if (recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        log.warn("login failed: client recaptcha failed (low score). id=" + body.get("id"));
        return RestResponse.restResponse(HttpStatus.OK, 6);
      }

      userOptional = userService.getUserById(body.get("id"));
      if (userOptional.isEmpty()) {
        log.error("login failed: user not found. id=" + body.get("id"));
        reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
        return RestResponse.restResponse(HttpStatus.OK, 1);
      }

      User user = userOptional.get();
      boolean auth = authService.authenticate(body.get("pwd"), user);
      int active = authService.checkActiveStatus(user);

      if (auth) {
        if (active == 0) {
          log.info("login success. id=" + user.getId());
          reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), true);
          userOptional.get().setLastLogin(new Timestamp(System.currentTimeMillis()));

          session.setAttribute("uid", user.getUid());
          session.setAttribute("grade", user.getGrade());
          if (user.isScodeCFlag()) {
            log.info("scode flag is true. user in schange mode. id=" + user.getId());
            session.setAttribute("schange", true);
            session.setAttribute("login", false);
            return RestResponse.restResponse(HttpStatus.OK, 7);
          } else {
            session.setAttribute("schange", false);
            session.setAttribute("login", true);
            session.setAttribute("id", user.getId());
            session.setAttribute("name", user.getName());
            session.setAttribute("priv", user.getPrivilege());
            log.info("session set. id=" + user.getId());
          }

          return RestResponse.restResponse(HttpStatus.OK, 0);
        } else if (active == 1) {
          log.info("login blocked(inactive). id=" + user.getId());
          reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
          return RestResponse.restResponse(HttpStatus.OK, 2);
        } else if (active == 2) {
          log.info("login blocked(banned). id=" + user.getId());
          reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
          return RestResponse.restResponse(HttpStatus.OK, 3);
        } else {
          log.info("login blocked(unknown status). id=" + user.getId());
          response.setStatus(500);
          reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
          return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        log.info("login blocked(password mismatch). id=" + user.getId());
        reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
        return RestResponse.restResponse(HttpStatus.OK, 4);
      }
    } catch (IOException e) {
      log.error("recaptcha failed(IOException).", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 5);
    }
  }

  @GetMapping(
    value = "signout",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String Signout(HttpSession session, HttpServletResponse response) {
    if (sessionService.isLoggedIn(session)) {
      session.setAttribute("login", false);
      log.info("user signed out. id=" + sessionService.getId(session));
      return RestResponse.restResponse(HttpStatus.OK);
    } else {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST);
    }
  }

  @GetMapping(
    value = "/authorize",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String checkAuth(HttpSession session) {
    boolean login = sessionService.isLoggedIn(session);
    return RestResponse.restResponse(HttpStatus.OK, login);
  }

  @GetMapping(
    value = "/authorize-e",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String checkAuthAndPrivilege(HttpSession session, @RequestParam("priv") int priv) {
    boolean login = sessionService.checkPrivilege(session, priv);
    return RestResponse.restResponse(HttpStatus.OK, login);
  }

  /**
   * 0: ok
   * 1: already logged in
   * 2: user not found
   * 3: already requested
   */
  @GetMapping(
    value = "/reset-passwd/verify",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String queryResetPasswd(
    HttpSession session,
    @RequestParam("id") String id
  ) {
    if (sessionService.isLoggedIn(session)) {
      return RestResponse.restResponse(HttpStatus.OK, 1);
    }
    log.info("password reset verified. id=" + id);
    return RestResponse.restResponse(HttpStatus.OK, resetPasswordService.getState(id));
  }

  /**
   * 0: ok
   * 1: already logged in
   * 2: insufficient parameter(s)
   * 3: recaptcha failed
   * 4: client recaptcha failed (low score)
   * 5: user not found
   * 6: bad identity
   * 7: already requested
   */
  @PostMapping(
    value = "/reset-passwd/request",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String createResetPasswordRequest(
    HttpSession session,
    @RequestBody Map<String, String> body,
    HttpServletResponse response
  ) {
    if (sessionService.isLoggedIn(session)) {
      response.setStatus(400);
      log.error("reset password request failed: already logged in.");
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 1);
    }
    if (!Validation.checkKeys(body, "id", "name", "scode", "ctoken")) {
      log.error("reset password request failed: insufficient parameter(s).");
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    }

    try {
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(body.get("ctoken"), "reset_password_request", false);
      if (!recaptchaReply.isOk()) {
        log.warn("reset password request failed: recaptcha failed.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
      }

      if (recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        log.warn("reset password request failed: client recaptcha failed (low score).");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
      }

      String name = body.get("name");
      int scode = Integer.parseInt(body.get("scode"));

      Optional<User> userOptional = userService.getUserById(body.get("id"));
      if (userOptional.isEmpty()) {
        reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
        log.error("reset password request failed: user not found. id=" + body.get("id"));
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 5);
      }
      User user = userOptional.get();

      if (!user.getName().equals(name) || !(user.getGrade() * 1000 + user.getClas() * 100 + user.getScode() == scode)) {
        reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
        log.error("reset password request failed: bad identity.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 6);
      }

      if (resetPasswordService.checkExistsForUser(user.getUid())) {
        reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
        log.error("reset password request failed: already requested. id=" + user.getId());
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 7);
      }

      resetPasswordService.createRequest(user.getUid());
      log.info("reset password request success. id=" + user.getId());
      return RestResponse.restResponse(HttpStatus.OK, 0);
    } catch (Exception e) {
      log.error("reset password request failed", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * [data]: success
   * 1: user not found
   * 2: request not found
   */
  @GetMapping(
    value = "/reset-passwd/query",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String queryResetPassword(
    @RequestParam("id") String id,
    HttpServletResponse response
  ) {
    // 1. check if user exists
    Optional<User> userOptional = userService.getUserById(id);
    if (userOptional.isEmpty()) {
      log.error("reset password query failed: user not found.");
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 1);
    }
    User user = userOptional.get();

    // 2. check if request exists
    Optional<ResetPasswordReq> rpqOptional = resetPasswordService.getRequest(user.getUid());
    if (rpqOptional.isEmpty()) {
      log.error("reset password query failed: request not found. id=" + user.getId());
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    }
    ResetPasswordReq req = rpqOptional.get();

    // 3. return
    log.info("reset password query success. id=" + user.getId());
    JSONObject ret = new JSONObject();
    ret.put("status", req.getStatus());
    if (req.getStatus() == ResetPasswordReq.RESET_PWD_STATUS.REQUESTED && req.getPrivateCode() == null) {
      log.info("generating private code for req uid " + req.getUid() + ". id=" + user.getId());
      String code = randomCode.certString();
      rpqOptional.get().setPrivateCode(passwordEncoder.encode(code));
      rpqOptional.get().setStatus(ResetPasswordReq.RESET_PWD_STATUS.WAITING);
      ret.put("privateCode", code);
    }
    ret.put("reqDate", req.getRequestDate());
    return RestResponse.restResponse(HttpStatus.OK, ret);
  }

  /**
   * 0: ok
   * 1: insufficient parameter(s)
   * 2: request not found(invalid token)
   * 3: invalid private code
   * 4: invalid status
   * 5: recaptcha failed
   * 6: client recaptcha failed (low score)
   * 7: internal server error
   */
  @PostMapping(
    value = "/reset-passwd/check-private",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String checkPrivateCode(
    @RequestBody Map<String, String> body,
    HttpSession session,
    HttpServletResponse response
  ) {
    if (!Validation.checkKeys(body, "token", "privateCode", "ctoken")) {
      log.error("reset password check private code failed: insufficient parameter(s).");
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 1);
    }

    String ctoken = body.get("ctoken");
    String token = body.get("token");
    String privateCode = body.get("privateCode");

    try {
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(ctoken, "check_private_code", false);
      if (!recaptchaReply.isOk()) {
        log.warn("check private code request failed: recaptcha failed.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 5);
      }

      if (recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        log.warn("check private code failed: client recaptcha failed (low score).");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 6);
      }

      Optional<ResetPasswordReq> rpqOptional = resetPasswordService.getRequestByRandUrl(token);
      if (rpqOptional.isEmpty()) {
        log.error("reset password check private code failed: request not found.");
        response.setStatus(400);
        reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
      }
      if (!passwordEncoder.matches(privateCode, rpqOptional.get().getPrivateCode())) {
        log.warn("reset password check private code failed: invalid private code");
        response.setStatus(400);
        reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
      }
      if (rpqOptional.get().getStatus() != ResetPasswordReq.RESET_PWD_STATUS.APPROVED) {
        log.warn("reset password check private code failed: invalid status");
        response.setStatus(400);
        reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
      }

      rpqOptional.get().setStatus(ResetPasswordReq.RESET_PWD_STATUS.CLOSED);
      session.setAttribute("changingPwd", true);
      session.setAttribute("pwdToken", token);
      reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), true);
      log.info("reset password check private code success. reqId=" + rpqOptional.get().getUid() + ". uuid=" + rpqOptional.get().getUuid());
      return RestResponse.restResponse(HttpStatus.OK);
    } catch (IOException e) {
      log.error("recaptcha failed(IOException).", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 7);
    }
  }

  /**
   * 0: success
   * 1: insufficient parameter(s)
   * 2: unprepared session
   * 3: password too short
   * 4: recaptcha failed
   * 5: client recaptcha failed (low score)
   * 6: user/request not found
   * 7: internal server error
   */
  @PatchMapping(
    value = "/reset-passwd/reset",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String resetPasswd(
    HttpSession session,
    HttpServletResponse response,
    @RequestBody Map<String, String> body
  ) {
    if (!Validation.checkKeys(body, "pwd", "token", "ctoken")) {
      log.error("reset password failed: insufficient parameter(s).");
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 1);
    }

    try {
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(body.get("ctoken"), "reset_password", false);
      if (!recaptchaReply.isOk()) {
        log.warn("reset password failed: recaptcha failed.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
      }

      if (recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        log.warn("reset password failed: client recaptcha failed (low score).");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 5);
      }

      // check session
      Object sFlag = session.getAttribute("changingPwd");
      Object token = session.getAttribute("pwdToken");
      if (sFlag == null || token == null) {
        log.error("reset password failed: unprepared session(at primary check).");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
      }
      if (!((boolean) sFlag) || !token.toString().equals(token)) {
        log.error("reset password failed: unprepared session(at secondary check).");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
      }

      // check password
      String pwd = body.get("pwd");
      if (pwd.length() < 6) {
        log.error("reset password failed: password too short.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
      }

      // update pwd
      Optional<ResetPasswordReq> rpqOptional = resetPasswordService.getRequestByRandUrl(token.toString());
      if (rpqOptional.isEmpty()) {
        log.error("reset password failed: request not found.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 6);
      }
      int uid = rpqOptional.get().getUuid();
      int res = userService.updatePassword(uid, pwd);
      if (res == 0) {
        log.info("reset password success. uid=" + uid);
        return RestResponse.restResponse(HttpStatus.OK);
      } else {
        log.error("reset password failed: user not found. uuid=" + uid);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, res);
      }
    } catch (Exception e) {
      log.error("reset password failed: internal server error.", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 7);
    }
  }

  /**
   * 0: success
   * 1: invalid session
   * 2: insufficient parameter(s)
   * 3: invalid parameter(s)
   * 4: user not found
   * 5: password mismatch
   * 6: internal server error
   * 7: recaptcha failed
   * 8: client recaptcha failed (low score)
   */
  @PatchMapping(
    value = "/password/patch",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String changePassword(
    HttpSession session, HttpServletResponse response,
    @RequestBody Map<String, String> body
  ) {
    if (!sessionService.isLoggedIn(session)) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.FORBIDDEN, 1);
    }

    if (!Validation.checkKeys(body, "currentPwd", "newPwd", "ctoken")) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    }

    if(
      body.get("newPwd").length() < 6 ||
      body.get("newPwd").length() > 100 ||
      body.get("currentPwd").length() < 6 ||
      body.get("currentPwd").length() > 100
    )
      {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
    }

    String newPwd = body.get("newPwd");
    String oldPwd = body.get("currentPwd");
    String ctoken = body.get("ctoken");
    String id = sessionService.getId(session);

    try {
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(ctoken, "change_password", false);

      if(!recaptchaReply.isOk()) {
        log.info("password change failed. recaptcha failed. id=" + id);
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 7);
      }

      if (recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        log.warn("password change failed: client recaptcha failed (low score). id=" + id);
        return RestResponse.restResponse(HttpStatus.BAD_GATEWAY, 8);
      }

      int uid = sessionService.getUid(session);
      Optional<User> userOptional = userService.getUserByUid(uid);
      if(userOptional.isEmpty()) {
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
      }

      boolean auth = authService.authenticate(oldPwd, userOptional.get());
      if(!auth) {
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 5);
      }

      int res = userService.updatePassword(userOptional, newPwd);
      if (res == 0) {
        log.info("password changed. uid=" + uid);
        return RestResponse.restResponse(HttpStatus.OK);
      } else {
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, res);
      }
    } catch (IonException e) {
      log.error("password change failed", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 6);
    } catch (IOException e) {
        log.error("password change failed. recaptcha failed.", e);
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 6);
    }
  }

  /**
   * [data]: success
   * 1: forbidden
   * 2: user not found
   * 3: internal server error
   */
  @GetMapping(
    value = "/passkey/registration/options/get",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String getRegistrationOptions(HttpSession session, HttpServletResponse response) {
    if (!sessionService.isLoggedIn(session)) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.FORBIDDEN, 1);
    }

    try {
      int uid = sessionService.getUid(session);
      Optional<JSONObject> ret = passkeyService.credentialCreateJson(session, uid);

      if (ret.isEmpty()) {
        response.setStatus(400);
        log.warn("passkey get registration options failed: user not found. uid=" + uid);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
      }
      return RestResponse.restResponse(HttpStatus.OK, ret.get());
    } catch (JsonProcessingException | IonException e) {
      log.error("passkey get registration options failed", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 3);
    }
  }

  /**
   * [data]: success
   * 1: forbidden
   * 2: insufficient parameter(s)
   * 3: recaptcha failed
   * 4: client recaptcha failed (low score)
   * 5: registration failed
   * 6: internal server error
   */
  @PostMapping(
    value = "/passkey/registration/complete",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String completeRegistration(
    HttpSession session, HttpServletResponse response,
    @RequestBody String body
  ) {
    if (!sessionService.isLoggedIn(session)) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.FORBIDDEN, 1);
    }

    JSONObject bodyJson = new JSONObject(body);

    if(!bodyJson.has("attestation") || !bodyJson.has("ctoken")) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    }

    try {
      String ctoken = bodyJson.getString("ctoken");
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(ctoken, "register_passkey", false);
      if (!recaptchaReply.isOk()) {
        log.warn("passkey registration failed: recaptcha failed.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
      }
      if(recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        log.warn("passkey registration failed: client recaptcha failed (low score).");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
      }

      String attestation = bodyJson.getJSONObject("attestation").toString();

      boolean ok = passkeyService.completeRegistration(session, attestation);
      return RestResponse.restResponse(HttpStatus.OK, (ok ? 0 : 5));
    } catch (IOException e) {
      log.error("passkey complete registration failed", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 6);
    }
  }

  /**
   * [data]: success
   * 0: authenticated
   * 1: request was not found from session
   * 2: signature counter is not valid
   * 3: authentication failed
   * 4: passkey not found
   * 5: user not found
   * 6: user inactive
   * 7: user banned
   * 8: user unknown status
   * 9: scode change
   * 10: internal server error
   */
  @GetMapping(
    value = "/passkey/authentication/options/get",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String getAuthenticationOptions(HttpSession session, HttpServletResponse response) {
    try {
      JSONObject ret = passkeyService.startAssertion(session);
      return RestResponse.restResponse(HttpStatus.OK, ret);
    } catch (JsonProcessingException e) {
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    }
  }

  /**
   * 0: ok
   * 1: request was not found from session
   * 2: signature counter is not valid
   * 3: authentication failed
   * 4: passkey not found
   * 5: user not found
   * 6: user inactive
   * 7: user banned
   * 8: user unknown status
   * 9: scode change
   * 10: internal server error
   * 11: insufficient parameter(s)
   * 12: recaptcha failed
   * 13: client recaptcha failed (low score)
   */
  @PostMapping(
    value = "/passkey/authentication/complete",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String completeAuthentication(
    HttpSession session, HttpServletResponse response,
    @RequestBody String body
  ) {
    try {
      JSONObject bodyJson = new JSONObject(body);

      if(!bodyJson.has("ctoken") || !bodyJson.has("attestation") || !bodyJson.has("checkbox")) {
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 11);
      }

      String ctoken = bodyJson.getString("ctoken");
      boolean checkbox = bodyJson.getBoolean("checkbox");

      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(ctoken, "login", checkbox);
      if (!recaptchaReply.isOk()) {
        log.warn("passkey authentication failed: recaptcha failed.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 12);
      }
      if(recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        log.warn("passkey authentication failed: client recaptcha failed (low score).");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 13);
      }

      int result = passkeyService.completeAuthentication(session, bodyJson.getJSONObject("attestation").toString());

      if (result == 0 || result == 9) {
        reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), true);
        return RestResponse.restResponse(HttpStatus.OK, result);
      } else {
        return switch (result) {
          case 1 -> {
            response.setStatus(400);
            reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
            yield RestResponse.restResponse(HttpStatus.BAD_REQUEST, result);
          }
          case 2, 3, 4, 5, 6, 7, 8 -> {
            response.setStatus(401);
            reCaptchaAssessment.addAssessmentComment(recaptchaReply.getAssessmentName(), false);
            yield RestResponse.restResponse(HttpStatus.UNAUTHORIZED, result);
          }
          default -> {
            response.setStatus(500);
            yield RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 10);
          }
        };
      }
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * [data]: success
   * 1: forbidden
   * 2: user not found
   * 3: internal server error
   */
  @GetMapping(
    value = "/passkey/get",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public String queryPasskeys(HttpSession session, HttpServletResponse response) {
    if (!sessionService.isLoggedIn(session)) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.FORBIDDEN, 1);
    }

    try {
      int uid = sessionService.getUid(session);
      if (userService.existsUserByUid(uid)) {
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
      }
      return RestResponse.restResponse(HttpStatus.OK, passkeyService.queryPasskey(uid));
    } catch (Exception e) {
      log.error("passkey query failed", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 2);
    }
  }

  /**
   * 0: success
   * 1: forbidden
   * 2: insufficient parameter(s)
   * 3: passkey not found
   * 4: not passkey owner
   * 5: internal server error
   * 6: recaptcha failed
   * 7: client recaptcha failed (low score)
   */
  @DeleteMapping(
    value = "/passkey/delete",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String deletePasskey(
    HttpSession session, HttpServletResponse response,
    @RequestBody Map<String, String> body
  ) {
    if (!sessionService.isLoggedIn(session)) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.FORBIDDEN, 1);
    }

    if (!Validation.checkKeys(body, "credentialId", "ctoken")) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    }

    try {
      String ctoken = body.get("ctoken");
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(ctoken, "delete_passkey", false);
      if (!recaptchaReply.isOk()) {
        log.warn("passkey delete failed: recaptcha failed.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 6);
      }
      if(recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        log.warn("passkey delete failed: client recaptcha failed (low score).");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 7);
      }

      int uid = sessionService.getUid(session);
      String id = body.get("credentialId");
      int result = passkeyService.deletePasskey(uid, id);
      if (result == 0) {
        log.info("deleted passkey. uid=" + uid + ", id=" + id);
        return RestResponse.restResponse(HttpStatus.OK);
      } else {
        log.info("passkey delete failed. uid=" + uid + ", id=" + id + ", result=" + result);
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, result);
      }
    } catch (Exception e) {
      log.error("passkey delete failed", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 5);
    }
  }

  /**
   * 0: success
   * 1: forbidden
   * 2: insufficient parameter(s)
   * 3: invalid name
   * 4: passkey not found
   * 5: not passkey owner
   * 6: internal server error
   * 7: recaptcha failed
   * 8: client recaptcha failed (low score)
   */
  @PatchMapping(
    value = "/passkey/edit/name",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  @Transactional
  public String editPasskeyName(
    HttpSession session, HttpServletResponse response,
    @RequestBody Map<String, String> body
  ) {
    if (!sessionService.isLoggedIn(session)) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.FORBIDDEN, 1);
    }

    if (!Validation.checkKeys(body, "credentialId", "name", "ctoken")) {
      response.setStatus(400);
      return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
    }

    try {
      String ctoken = body.get("ctoken");
      RecaptchaReply recaptchaReply = reCaptchaAssessment.performAssessment(ctoken, "edit_passkey", false);
      if (!recaptchaReply.isOk()) {
        log.warn("passkey edit name failed: recaptcha failed.");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 7);
      }
      if(recaptchaReply.getScore() <= CAPTCHA_THRESHOLD) {
        log.warn("passkey edit name failed: client recaptcha failed (low score).");
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 8);
      }

      int uid = sessionService.getUid(session);
      String id = body.get("credentialId");
      String name = body.get("name");

      if(name.isEmpty() || name.length() > 30) {
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
      }

      int result = passkeyService.editPasskeyName(uid, id, name);
      if (result == 0) {
        log.info("edited passkey name. uid=" + uid + ", id=" + id + ", name=" + name);
        return RestResponse.restResponse(HttpStatus.OK);
      } else {
        log.info("passkey edit name failed. uid=" + uid + ", id=" + id + ", name=" + name + ", result=" + result);
        response.setStatus(400);
        return RestResponse.restResponse(HttpStatus.BAD_REQUEST, result);
      }
    } catch (Exception e) {
      log.error("passkey edit name failed", e);
      response.setStatus(500);
      return RestResponse.restResponse(HttpStatus.INTERNAL_SERVER_ERROR, 5);
    }
  }
}
