package com.github.miho73.ion.controller;

import com.github.miho73.ion.dto.NsRecord;
import com.github.miho73.ion.dto.ResetPasswordReq;
import com.github.miho73.ion.dto.User;
import com.github.miho73.ion.exceptions.IonException;
import com.github.miho73.ion.service.auth.ResetPasswordService;
import com.github.miho73.ion.service.auth.SessionService;
import com.github.miho73.ion.service.ionid.IonIdManageService;
import com.github.miho73.ion.service.ionid.UserService;
import com.github.miho73.ion.service.manage.NsManageService;
import com.github.miho73.ion.service.ns.NsService;
import com.github.miho73.ion.utils.RandomCode;
import com.github.miho73.ion.utils.RestResponse;
import com.github.miho73.ion.utils.Validation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/manage/api")
public class ManageController {
    final
    SessionService sessionService;

    final
    RandomCode randomCode;

    final
    UserService userService;

    final
    IonIdManageService ionIdManageService;

    final
    NsService nsService;

    final
    ResetPasswordService resetPasswordService;

    final
    NsManageService nsManageService;

    public ManageController(SessionService sessionService, UserService userService, IonIdManageService ionIdManageService, NsService nsService, ResetPasswordService resetPasswordService, RandomCode randomCode, NsManageService nsManageService) {
        this.sessionService = sessionService;
        this.userService = userService;
        this.ionIdManageService = ionIdManageService;
        this.nsService = nsService;
        this.resetPasswordService = resetPasswordService;
        this.randomCode = randomCode;
        this.nsManageService = nsManageService;
    }

    /**
     * 0: OK
     * 1: Invalid session
     * 2: insufficient parameter
     * 3: invalid new status
     * 4: no user with such id
     * 5: no self modify
     */
    @PatchMapping(
            value = "/ionid/active/patch",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Transactional
    public String activePath(
            HttpServletResponse response,
            @RequestBody Map<String, String> body,
            HttpSession session
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.FACULTY_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }
        if (!Validation.checkKeys(body, "id", "ac")) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }

        String uid = body.get("id");
        int status = Integer.parseInt(body.get("ac"));
        if (status < 0 || status > 2) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
        }
        if (userService.existsUserById(uid)) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
        }
        if (sessionService.getId(session).equals(uid)) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 5);
        }

        ionIdManageService.updateActiveState(uid, status);

        JSONObject ret = new JSONObject();
        ret.put("sub", uid);
        String nst = switch (status) {
            case 0 -> "INACTIVE";
            case 1 -> "ACTIVE";
            case 2 -> "BANNED";
            default -> "unknown";
        };
        ret.put("act", nst);
        return RestResponse.restResponse(HttpStatus.OK, ret);
    }

    /**
     * [data]: success
     * 1: invalid session
     * 2: no user with such id
     */
    @GetMapping(
            value = "/ionid/get",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String getUser(
            HttpSession session,
            HttpServletResponse response,
            @RequestParam("id") String id
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.FACULTY_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        User user;
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isEmpty()) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }

        user = userOptional.get();
        JSONObject ret = new JSONObject();
        ret.put("ui", user.getUid());
        ret.put("na", user.getName());
        ret.put("gr", user.getGrade());
        ret.put("cl", user.getClas());
        ret.put("sc", user.getScode());
        ret.put("sf", user.isScodeCFlag());
        ret.put("id", user.getId());
        ret.put("ll", user.getLastLogin() == null ? "N/A" : user.getLastLogin().toString());
        ret.put("jd", user.getJoinDate().toString());
        ret.put("st", user.getStatus());
        ret.put("pr", user.getPrivilege());
        return RestResponse.restResponse(HttpStatus.OK, ret);
    }

    /**
     * 0: ok
     * 1: invalid session
     * 2: insufficient parameter
     * 3: user not found
     */
    @PatchMapping(
            value = "/ionid/eliminate",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Transactional
    public String removeGrade(
            HttpSession session,
            HttpServletResponse response,
            @RequestBody Map<String, String> body
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.ROOT_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }
        if (!Validation.checkKeys(body, "id")) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }
        String id = body.get("id");

        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isEmpty()) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
        }
        User user = userOptional.get();
        userService.resetGrade(user.getUid());
        return RestResponse.restResponse(HttpStatus.OK);
    }

    /**
     * [data]: success
     * 1: invalid session
     * 2: no user with such id
     */
    @GetMapping(
            value = "/privilege/get",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String getPrivilege(
            HttpSession session,
            HttpServletResponse response,
            @RequestParam("id") String id
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.ROOT_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isEmpty()) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }
        return RestResponse.restResponse(HttpStatus.OK, userOptional.get().getPrivilege());
    }

    /**
     * [data]: success
     * 1: invalid session
     * 2: no user with such id
     * 3: no self modify
     */
    @PatchMapping(
            value = "/privilege/patch",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Transactional
    public String setPrivilege(
            HttpSession session,
            HttpServletResponse response,
            @RequestBody Map<String, String> body
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.ROOT_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }
        if (!Validation.checkKeys(body, "id", "pr")) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }

        String id = body.get("id");
        int privilege = Integer.parseInt(body.get("pr"));

        if (userService.existsUserById(id)) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }
        if (sessionService.getId(session).equals(id)) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
        }

        userService.updatePrivilege(id, privilege);

        JSONObject ret = new JSONObject();
        ret.put("id", id);
        ret.put("pr", privilege);
        return RestResponse.restResponse(HttpStatus.OK, ret);
    }

    DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");

    /**
     * [data]: success
     * 1: invalid session
     */
    @GetMapping(
            value = "/ns/get",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String getNs(
            HttpSession session,
            HttpServletResponse response
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.FACULTY_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        String sname = sessionService.getName(session);
        JSONArray lst = nsService.getNsBySupervisor(sname);
        JSONObject ret = new JSONObject();
        ret.put("nss", lst);
        ret.put("date", LocalDate.now().format(dtf));
        return RestResponse.restResponse(HttpStatus.OK, ret);
    }

    /**
     * 0: ok
     * 1: invalid session
     * 2: insufficient parameter
     * 3: no ns with such id
     */
    @PatchMapping(
            value = "/ns/accept",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Transactional
    public String changeAccept(
            HttpSession session,
            HttpServletResponse response,
            @RequestBody Map<String, String> body
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.FACULTY_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }
        if (!Validation.checkKeys(body, "id", "ac")) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }

        int id = Integer.parseInt(body.get("id"));
        boolean accept = Boolean.parseBoolean(body.get("ac"));


        if (!nsService.existsNsById(id)) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
        }

        nsService.acceptNs(id, accept);
        return RestResponse.restResponse(HttpStatus.OK);
    }

    /**
     * [data]: success
     * 1: invalid session
     * 2: ionid not found
     */
    @GetMapping(
            value = "/ns/get-user",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String getUserNs(
            HttpSession session,
            HttpServletResponse response,
            @RequestParam("code") int scode
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.FACULTY_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        Optional<User> userOptional = userService.getUserByScode(scode);
        if (userOptional.isEmpty()) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }
        JSONArray ret = nsService.getNsList(userOptional.get().getUid());

        JSONObject reply = new JSONObject();
        reply.put("reqs", ret);
        reply.put("date", LocalDate.now().format(dtf));
        return RestResponse.restResponse(HttpStatus.OK, reply);
    }

    /**
     * 0: ok
     * 1: invalid session
     * 2: insufficient property
     * 3: no user with such scode
     * 4: already requested
     * 5: invalid time for current preset
     */
    @PostMapping(
            value = "/ns/create",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String createNs(
            HttpSession session,
            HttpServletResponse response,
            @RequestBody Map<String, String> body
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.FACULTY_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        if (!Validation.checkKeys(body, "scode", "time", "place", "reason")) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }

        int scode = Integer.parseInt(body.get("scode"));
        NsRecord.NS_TIME nsTime = NsRecord.intToNsTime(Integer.parseInt(body.get("time")));

        Optional<User> userOptional = userService.getUserByScode(scode);
        if (userOptional.isEmpty()) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
        }
        User user = userOptional.get();

        if (nsService.existsNsByUuid(user.getUid(), nsTime)) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
        }

        if(nsService.timePreset == NsService.TIMETABLE_TEMPLATE.NS3) {
            if(
                    nsTime != NsRecord.NS_TIME.N8 &&
                            nsTime != NsRecord.NS_TIME.N1 &&
                            nsTime != NsRecord.NS_TIME.N2
            ) {
                response.setStatus(400);
                return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 5);
            }
        }
        if(nsService.timePreset == NsService.TIMETABLE_TEMPLATE.NS4) {
            if(
                    nsTime != NsRecord.NS_TIME.ND1 &&
                    nsTime != NsRecord.NS_TIME.ND2 &&
                    nsTime != NsRecord.NS_TIME.NN1 &&
                    nsTime != NsRecord.NS_TIME.NN2
            ) {
                response.setStatus(400);
                return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 5);
            }
        }

        body.put("supervisor", sessionService.getName(session));
        nsService.saveNsRequest(user.getUid(), nsTime, false, body);

        response.setStatus(201);
        return RestResponse.restResponse(HttpStatus.CREATED, 0);
    }

    /**
     * 0: ok
     * 1: invalid session
     * 2: insufficient property
     * 3: no user with such scode
     * 4: no ns found
     */
    @DeleteMapping(
            value = "/ns/delete",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Transactional
    public String deleteNs(
            HttpSession session,
            HttpServletResponse response,
            @RequestParam("code") int scode,
            @RequestParam("time") NsRecord.NS_TIME nsTime
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.FACULTY_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        Optional<User> userOptional = userService.getUserByScode(scode);
        if (userOptional.isEmpty()) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
        }
        User user = userOptional.get();

        try {
            nsService.deleteNs(user.getUid(), nsTime);
            return RestResponse.restResponse(HttpStatus.OK, 0);
        } catch (IonException e) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
        }
    }

    /**
     * [data]: ok
     * 1: invalid session
     */
    @GetMapping(
            value = "/ns/print",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String getPrintData(
            HttpSession session,
            HttpServletResponse response,
            @RequestParam("grade") int grade
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.FACULTY_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        JSONArray ret;
        if(nsService.timePreset == NsService.TIMETABLE_TEMPLATE.NS3) {
            ret = nsManageService.printNsListNS3(grade);
        }
        else if (nsService.timePreset == NsService.TIMETABLE_TEMPLATE.NS4) {
            ret = nsManageService.printNsListNS4(grade);
        }
        else {
            ret = new JSONArray();
        }

        JSONObject reply = new JSONObject();
        reply.put("ns", ret);
        reply.put("qtime", new SimpleDateFormat("yyyy.MM.dd HH.mm.ss").format(new Date()));
        return RestResponse.restResponse(HttpStatus.OK, reply);
    }

    /**
     * [data]: ok
     * 1: invalid session
     */
    @GetMapping(
            value = "/ns/mode/get",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String getNsMode(
            HttpSession session,
            HttpServletResponse response
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.FACULTY_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }
        return RestResponse.restResponse(HttpStatus.OK, nsService.getTimePreset());
    }

    /**
     * 0: ok
     * 1: invalid session
     * 2: insufficient parameter
     * 3: invalid mode
     */
    @PatchMapping(
            value = "/ns/mode/set",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String updateNsTimePreset(
            HttpSession session,
            HttpServletResponse response,
            @RequestBody Map<String, String> body
    ) {
        if(!sessionService.checkPrivilege(session, SessionService.ROOT_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        if(!Validation.checkKeys(body, "mode")) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }

        int mode = Integer.parseInt(body.get("mode"));

        if(mode != 0 && mode != 1) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
        }

        nsService.setTimePreset(mode);
        return RestResponse.restResponse(HttpStatus.OK, 0);
    }

    /**
     * 0: success
     * 1: invalid session
     * 2: internal server error
     */
    @PatchMapping(
            value = "/bulk/promote"
    )
    @Transactional
    public String promote(HttpSession session, HttpServletResponse response) {
        if (!sessionService.checkPrivilege(session, SessionService.ROOT_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        userService.promoteAll();
        return RestResponse.restResponse(HttpStatus.OK, 0);
    }

    /**
     * 0: success
     * 1: invalid session
     * 2: insufficient parameter
     * 3: invalud parameter
     */
    @PatchMapping(
            value = "/bulk/default-ionid-state/set",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String setDefaultIonIDState(
            HttpSession session,
            HttpServletResponse response,
            @RequestBody Map<String, String> body
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.ROOT_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }
        if (!Validation.checkKeys(body, "defaultState")) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 2);
        }

        try {
            userService.setDefaultIonIDState(Integer.parseInt(body.get("defaultState")));
        } catch (IonException e) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 3);
        }
        return RestResponse.restResponse(HttpStatus.OK, 0);
    }

    /**
     * [data]: success
     * 1: invalid session
     */
    @GetMapping(
            value = "/bulk/default-ionid-state/get"
    )
    public String getDefaultIonIDState(
            HttpSession session,
            HttpServletResponse response
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.ROOT_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }
        return RestResponse.restResponse(HttpStatus.OK, userService.getDefaultUserState());
    }

    /**
     * [data]: success
     * 1: invalid session
     * 2: request not found
     * 3: user not found
     */
    @GetMapping(
            value = "/reset-passwd/query",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String queryResetPwdReq(
            @RequestParam("id") String id,
            HttpServletResponse response,
            HttpSession session
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.ROOT_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }

        //1. get user by id
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isEmpty()) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
        }
        User user = userOptional.get();

        // 2. get request by user entity
        Optional<ResetPasswordReq> rpq = resetPasswordService.getRequest(user.getUid());
        if (rpq.isEmpty()) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }

        ResetPasswordReq req = rpq.get();
        if (!req.getRequestDate().equals(LocalDate.now())) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }

        // 3. return request
        JSONObject ret = new JSONObject();
        ret.put("id", user.getId());
        ret.put("name", user.getName());
        ret.put("scode", user.getGrade() * 1000 + user.getClas() * 100 + user.getScode());
        ret.put("status", req.getStatus());
        ret.put("uid", req.getUid());
        return RestResponse.restResponse(HttpStatus.OK, ret);
    }

    /**
     * 0: success
     * 1: invalid session
     * 2: insufficient parameter(s)
     * 3: request not found
     * 4: invalid status
     */
    @PatchMapping(
            value = "/reset-passwd/accept",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Transactional
    public String acceptResetPwd(
            HttpSession session,
            HttpServletResponse response,
            @RequestBody Map<String, String> body
    ) {
        if (!sessionService.checkPrivilege(session, SessionService.ROOT_PRIVILEGE)) {
            response.setStatus(401);
            return RestResponse.restResponse(HttpStatus.UNAUTHORIZED, 1);
        }
        if (!Validation.checkKeys(body, "reqUid", "accept")) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 2);
        }
        int uid = Integer.parseInt(body.get("reqUid"));
        Optional<ResetPasswordReq> reqOptional = resetPasswordService.getRequestByUid(uid);
        if (reqOptional.isEmpty()) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 3);
        }
        ResetPasswordReq req = reqOptional.get();
        if (req.getStatus() != ResetPasswordReq.RESET_PWD_STATUS.WAITING && req.getStatus() != ResetPasswordReq.RESET_PWD_STATUS.REQUESTED) {
            response.setStatus(400);
            return RestResponse.restResponse(HttpStatus.BAD_REQUEST, 4);
        }

        boolean aprv = Boolean.parseBoolean(body.get("accept"));
        resetPasswordService.acceptRequest(uid, aprv);
        if (aprv) {
            String code = randomCode.randomString(128);
            reqOptional.get().setRandUrl(code);
            reqOptional.get().setStatus(ResetPasswordReq.RESET_PWD_STATUS.APPROVED);
            return RestResponse.restResponse(HttpStatus.OK, code);
        } else return RestResponse.restResponse(HttpStatus.OK);
    }
}
