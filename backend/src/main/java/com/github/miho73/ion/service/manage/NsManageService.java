package com.github.miho73.ion.service.manage;

import com.github.miho73.ion.dto.NsRecord;
import com.github.miho73.ion.dto.User;
import com.github.miho73.ion.service.ionid.UserService;
import com.github.miho73.ion.service.ns.NsService;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class NsManageService {
  @Autowired
  UserService userService;
  ;

  @Autowired
  NsService nsService;

  public JSONArray printNsListNS3(int grade) {
    List<User> users = userService.getUserByGrade(grade);
    JSONArray ret = new JSONArray();
    users.forEach(e -> {
      List<NsRecord> records = nsService.findByUuid(e.getUid());
      JSONObject element = new JSONObject();
      element.put("code", e.getGrade() * 1000 + e.getClas() * 100 + e.getScode());
      element.put("name", e.getName());
      records.forEach(s -> {
        String str = s.getNsPlace() + "/" + s.getNsSupervisor() + "/" + s.getNsReason();
        boolean aprv = (s.getNsState() == NsRecord.NS_STATE.APPROVED);
        JSONObject pt = new JSONObject();
        pt.put("c", str);
        pt.put("a", aprv);
        if (s.getNsTime() == NsRecord.NS_TIME.N8) element.put("0", pt);
        if (s.getNsTime() == NsRecord.NS_TIME.N1) element.put("1", pt);
        if (s.getNsTime() == NsRecord.NS_TIME.N2) element.put("2", pt);
      });
      ret.put(element);
    });

    return ret;
  }

  public JSONArray printNsListNS4(int grade) {
    List<User> users = userService.getUserByGrade(grade);
    JSONArray ret = new JSONArray();
    users.forEach(e -> {
      List<NsRecord> records = nsService.findByUuid(e.getUid());
      JSONObject element = new JSONObject();
      element.put("code", e.getGrade() * 1000 + e.getClas() * 100 + e.getScode());
      element.put("name", e.getName());
      records.forEach(s -> {
        String str = s.getNsPlace() + "/" + s.getNsSupervisor() + "/" + s.getNsReason();
        boolean aprv = (s.getNsState() == NsRecord.NS_STATE.APPROVED);
        JSONObject pt = new JSONObject();
        pt.put("c", str);
        pt.put("a", aprv);
        if (s.getNsTime() == NsRecord.NS_TIME.ND1) element.put("3", pt);
        if (s.getNsTime() == NsRecord.NS_TIME.ND2) element.put("4", pt);
        if (s.getNsTime() == NsRecord.NS_TIME.NN1) element.put("5", pt);
        if (s.getNsTime() == NsRecord.NS_TIME.NN2) element.put("6", pt);
      });
      ret.put(element);
    });

    return ret;
  }
}
