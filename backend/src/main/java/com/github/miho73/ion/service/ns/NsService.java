package com.github.miho73.ion.service.ns;

import com.github.miho73.ion.dto.LnsReservation;
import com.github.miho73.ion.dto.NsRecord;
import com.github.miho73.ion.dto.User;
import com.github.miho73.ion.exceptions.IonException;
import com.github.miho73.ion.repository.LnsRepository;
import com.github.miho73.ion.repository.NsRepository;
import com.github.miho73.ion.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class NsService {
  final
  NsRepository nsRepository;

  final
  LnsRepository lnsRepository;

  final
  UserRepository userRepository;

  public enum TIMETABLE_TEMPLATE {
    NS3, // n8, n1 n2
    NS4 // 오전1, 오전2, 오후1, 오후2
  }

  public TIMETABLE_TEMPLATE timePreset;

  public NsService(NsRepository nsRepository, LnsRepository lnsRepository, UserRepository userRepository) {
    this.nsRepository = nsRepository;
    this.lnsRepository = lnsRepository;
    this.userRepository = userRepository;

    this.timePreset = TIMETABLE_TEMPLATE.NS3;
  }

  public void setTimePreset(int timePreset) {
    switch (timePreset) {
      case 0 -> this.timePreset = TIMETABLE_TEMPLATE.NS3;
      case 1 -> this.timePreset = TIMETABLE_TEMPLATE.NS4;
    }
  }

  public int getTimePreset() {
    return switch (timePreset) {
      case NS3 -> 0;
      case NS4 -> 1;
    };
  }

  public NsRecord saveNsRequest(int uuid, NsRecord.NS_TIME nsTime, boolean lnsReq, Map<String, String> body) {
    NsRecord nsRecord = new NsRecord();

    // check if supervisor exists
    long supervisors = (long) nsRepository.findAllUserContainedInName(body.get("supervisor")).get(0)[0];
    if (supervisors == 0) {
      nsRecord.setNsState(NsRecord.NS_STATE.NO_SUPERVISOR);
    } else {
      nsRecord.setNsState(NsRecord.NS_STATE.REQUESTED);
    }

    nsRecord.setNsDate(LocalDate.now());
    nsRecord.setNsReqTime(new Timestamp(System.currentTimeMillis()));

    nsRecord.setNsTime(nsTime);
    nsRecord.setNsPlace(body.get("place"));
    nsRecord.setNsSupervisor(body.get("supervisor"));
    nsRecord.setNsReason(body.get("reason"));

    nsRecord.setLnsReq(lnsReq);
    nsRecord.setUuid(uuid);

    nsRecord = nsRepository.save(nsRecord);
    return nsRecord;
  }

  public JSONArray getNsList(int uuid) {
    List<NsRecord> rec = nsRepository.findByUuidAndNsDateOrderByNsTimeAsc(uuid, LocalDate.now());

    JSONArray ret = new JSONArray();
    for (NsRecord nsRecord : rec) {
      JSONObject ele = new JSONObject();
      ele.put("time", NsRecord.nsTimeToInt(nsRecord.getNsTime()));
      ele.put("supervisor", nsRecord.getNsSupervisor());
      ele.put("reason", nsRecord.getNsReason());
      ele.put("lnsReq", nsRecord.isLnsReq());
      ele.put("status", nsRecord.getNsState());
      ele.put("place", nsRecord.getNsPlace());
      if (nsRecord.isLnsReq()) {
        Optional<LnsReservation> lr = lnsRepository.findByNsLinkUid(nsRecord.getUid());
        if (lr.isEmpty()) ele.put("lnsSeat", "No Record");
        else ele.put("lnsSeat", lr.get().getSeat());
      }
      ret.put(ele);
    }
    return ret;
  }

  public LnsReservation saveLnsReservation(int uuid, NsRecord.NS_TIME nsTime, int grade, String seat, int linkUid) {
    if (existsLnsBySeat(nsTime, seat, grade)) {
      return null;
    }

    LnsReservation lnsRev = new LnsReservation();
    lnsRev.setLnsDate(LocalDate.now());
    lnsRev.setLnsTime(nsTime);
    lnsRev.setUuid(uuid);
    lnsRev.setSeat(seat);
    lnsRev.setGrade(grade);
    lnsRev.setNsLinkUid(linkUid);

    return lnsRepository.save(lnsRev);
  }

  public boolean existsLnsBySeat(NsRecord.NS_TIME nsTime, String seat, int grade) {
    return !lnsRepository.findByLnsTimeAndSeatAndLnsDateAndGrade(nsTime, seat, LocalDate.now(), grade).isEmpty();
  }

  public boolean existsNsByUuid(int uuid, NsRecord.NS_TIME nsTime) {
    return nsRepository.findByUuidAndNsDateAndNsTime(uuid, LocalDate.now(), nsTime).isPresent();
  }

  public void deleteNs(int uuid, NsRecord.NS_TIME time) throws IonException {
    Optional<NsRecord> nsRecord = nsRepository.findByUuidAndNsDateAndNsTime(uuid, LocalDate.now(), time);
    if (nsRecord.isPresent()) {
      NsRecord toDel = nsRecord.get();
      nsRepository.deleteById(toDel.getUid());
    } else {
      throw new IonException();
    }
  }

  public JSONArray getLnsSeat(int grade) {
    List<LnsReservation> lrev = lnsRepository.findByLnsDateAndGrade(LocalDate.now(), grade);

    JSONArray[] byNsTime = new JSONArray[7];

    byNsTime[0] = new JSONArray();
    byNsTime[1] = new JSONArray();
    byNsTime[2] = new JSONArray();
    byNsTime[3] = new JSONArray();
    byNsTime[4] = new JSONArray();
    byNsTime[5] = new JSONArray();
    byNsTime[6] = new JSONArray();

    lrev.forEach(e -> {
      JSONObject rev = new JSONObject();
      Optional<User> reserver = userRepository.findById(e.getUuid());
      if (reserver.isEmpty()) {
        rev.put("v", false);
      } else {
        User user = reserver.get();
        rev.put("v", true);
        rev.put("name", user.getName());
        rev.put("scode", user.getGrade() * 1000 + user.getClas() * 100 + user.getScode());
        rev.put("sn", e.getSeat());
        byNsTime[NsRecord.nsTimeToInt(e.getLnsTime())].put(rev);
      }
    });

    JSONArray ret = new JSONArray();
    ret.put(byNsTime[0]);
    ret.put(byNsTime[1]);
    ret.put(byNsTime[2]);
    ret.put(byNsTime[3]);
    ret.put(byNsTime[4]);
    ret.put(byNsTime[5]);
    ret.put(byNsTime[6]);
    return ret;
  }

  public JSONArray getNsBySupervisor(String sname) {
    List<NsRecord> rec = nsRepository.findByNsDateAndNsSupervisorContainsOrderByNsStateAscUuidAscNsTimeAsc(LocalDate.now(), sname);
    JSONArray lst = new JSONArray();
    rec.forEach(r -> {
      Optional<User> pla = userRepository.findById(r.getUuid());
      JSONObject e = new JSONObject();
      if (pla.isPresent()) {
        User u = pla.get();
        if (u.getStatus() != User.USER_STATUS.ACTIVATED) return;
        e.put("id", r.getUid());
        e.put("time", NsRecord.nsTimeToInt(r.getNsTime()));
        e.put("name", u.getName());
        e.put("rscode", u.getGrade() * 1000 + u.getClas() * 100 + u.getScode());
        e.put("place", r.getNsPlace());
        e.put("super", r.getNsSupervisor());
        e.put("reason", r.getNsReason());
        e.put("status", r.getNsState());
        e.put("v", true);
      } else {
        e.put("v", false);
      }
      lst.put(e);
    });
    return lst;
  }

  public void acceptNs(int id, boolean accept) {
    int ns = accept ? 1 : 2;
    nsRepository.updateAccept(id, ns);
  }

  public boolean existsNsById(int id) {
    return nsRepository.existsById(id);
  }

  public List<NsRecord> findByUuid(int uuid) {
    return nsRepository.findByUuidAndNsDateOrderByNsTimeAsc(uuid, LocalDate.now());
  }

  public JSONArray getLnsSeatRemaining(int grade) {
    if (timePreset == TIMETABLE_TEMPLATE.NS3) {
      return getLnsSeatRemainingNs3(grade);
    } else {
      return getLnsSeatRemainingNs4(grade);
    }
  }

  private JSONArray getLnsSeatRemainingNs3(int grade) {
    long n8 = lnsRepository.countByGradeAndLnsDateAndLnsTime(grade, LocalDate.now(), NsRecord.NS_TIME.N8);
    long n1 = lnsRepository.countByGradeAndLnsDateAndLnsTime(grade, LocalDate.now(), NsRecord.NS_TIME.N1);
    long n2 = lnsRepository.countByGradeAndLnsDateAndLnsTime(grade, LocalDate.now(), NsRecord.NS_TIME.N2);

    JSONArray ret = new JSONArray();
    ret.put(n8);
    ret.put(n1);
    ret.put(n2);
    return ret;
  }

  private JSONArray getLnsSeatRemainingNs4(int grade) {
    long nd1 = lnsRepository.countByGradeAndLnsDateAndLnsTime(grade, LocalDate.now(), NsRecord.NS_TIME.ND1);
    long nd2 = lnsRepository.countByGradeAndLnsDateAndLnsTime(grade, LocalDate.now(), NsRecord.NS_TIME.ND2);
    long nn1 = lnsRepository.countByGradeAndLnsDateAndLnsTime(grade, LocalDate.now(), NsRecord.NS_TIME.NN1);
    long nn2 = lnsRepository.countByGradeAndLnsDateAndLnsTime(grade, LocalDate.now(), NsRecord.NS_TIME.NN2);

    JSONArray ret = new JSONArray();
    ret.put(nd1);
    ret.put(nd2);
    ret.put(nn1);
    ret.put(nn2);
    return ret;
  }
}
