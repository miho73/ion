package com.github.miho73.ion.repository;

import com.github.miho73.ion.dto.PasskeyUserHandle;
import com.github.miho73.ion.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasskeyUserHandleRepository extends JpaRepository<PasskeyUserHandle, byte[]>{
    Optional<PasskeyUserHandle> findByUser_Uid(int uuid);
    Optional<PasskeyUserHandle> findByUser(User user);
}
