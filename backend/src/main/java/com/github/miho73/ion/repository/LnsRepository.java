package com.github.miho73.ion.repository;

import com.github.miho73.ion.dto.LnsReservation;
import com.github.miho73.ion.dto.NsRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LnsRepository extends JpaRepository<LnsReservation, Integer> {
    Optional<LnsReservation> findByNsLinkUid(int nsLinkUid);

    List<LnsReservation> findByLnsDateAndGrade(LocalDate lnsDate, int grade);

    List<LnsReservation> findByLnsTimeAndSeatAndLnsDateAndGrade(NsRecord.NS_TIME lnsTime, String seat, LocalDate lnsDate, int grade);

    void deleteByNsLinkUid(int nsLinkUid);

    long countByGradeAndLnsDateAndLnsTime(int grade, LocalDate lnsDate, NsRecord.NS_TIME lnsTime);
}
