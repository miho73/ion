package com.github.miho73.ion.repository;

import com.github.miho73.ion.dto.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(String id);

    @Modifying
    @Query(
        value = "UPDATE users.users SET status=:ns WHERE id=:id",
        nativeQuery = true
    )
    void updateActiveById(
        @Param("id") String id,
        @Param("ns") int ns
    );

    @Modifying
    @Query(
        value = "UPDATE users.users SET privilege=:privilege WHERE id=:id",
        nativeQuery = true
    )
    void updatePrivilegeById(
        @Param("id") String id,
        @Param("privilege") int privilege
    );

    Optional<User> findByGradeAndClasAndScode(int grade, int clas, int scode);

    List<User> findByGradeAndStatusOrderByClasAscScodeAsc(int grade, User.USER_STATUS status);

    @Modifying
    @Query(
        value = "UPDATE users.users SET grade=0, clas=0, scode=0 WHERE uid=:uid",
        nativeQuery = true
    )
    void resetGradeByUid(
        @Param("uid") int uid
    );

    @Modifying
    @Query(
        value = "UPDATE users.users SET grade=grade+1, scode_cflag=true WHERE (grade=1 OR grade=2) AND status=1",
        nativeQuery = true
    )
    void resetGradeOnPromote();

    void deleteByGrade(int grade);

    void deleteById(String id);
}
