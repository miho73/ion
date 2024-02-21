package com.github.miho73.ion.repository;

import com.github.miho73.ion.dto.ResetPasswordReq;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResetPasswordRepository extends JpaRepository<ResetPasswordReq, Integer> {
  Optional<ResetPasswordReq> findByUuid(int uuid);

  @Modifying
  @Query(value = "TRUNCATE TABLE auth.reset_pwd_req RESTART IDENTITY", nativeQuery = true)
  void truncateTable();

  @Query(
    value = "UPDATE auth.reset_pwd_req SET status = 2 WHERE uid = :uid and (status = 1 OR status = 0)",
    nativeQuery = true
  )
  @Modifying
  void acceptRequest(
    @Param("uid") int uid
  );

  @Query(
    value = "UPDATE auth.reset_pwd_req SET status = 3 WHERE uid = :uid and (status = 1 OR status = 0)",
    nativeQuery = true
  )
  @Modifying
  void rejectRequest(
    @Param("uid") int uid
  );

  Optional<ResetPasswordReq> findByRandUrl(String token);
}
