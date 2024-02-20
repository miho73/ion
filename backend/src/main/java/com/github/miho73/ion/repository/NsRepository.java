package com.github.miho73.ion.repository;

import com.github.miho73.ion.dto.NsRecord;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NsRepository extends JpaRepository<NsRecord, Integer> {
    List<NsRecord> findByUuidAndNsDateOrderByNsTimeAsc(int uuid, LocalDate nsDate);

    Optional<NsRecord> findByUuidAndNsDateAndNsTime(int uuid, LocalDate nsDate, NsRecord.NS_TIME nsTime);

    void deleteByUuidAndNsTimeAndNsDate(int uuid, NsRecord.NS_TIME time, LocalDate nsDate);

    List<NsRecord> findByNsDateAndNsSupervisorContainsOrderByNsStateAscUuidAscNsTimeAsc(LocalDate date, String nsSupervisor);

    @Query(
        value = "SELECT COUNT(*) FROM users.users WHERE :query LIKE concat('%', users.name, '%')",
        nativeQuery = true
    )
    List<Object[]> findAllUserContainedInName(
        @Param("query") String query
    );

    @Modifying
    @Query(
        value = "UPDATE ns.ns_request SET status=:status WHERE uid=:uid",
        nativeQuery = true
    )
    void updateAccept(
        @Param("uid") int uid,
        @Param("status") int status
    );
}
