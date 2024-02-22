package com.github.miho73.ion.repository;

import com.github.miho73.ion.dto.Passkey;
import com.github.miho73.ion.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasskeyRepository extends JpaRepository<Passkey, byte[]> {
  List<Passkey> findAllByUser(User user);

  Optional<Passkey> findByCredIdAndUserHandle(byte[] credId, byte[] userHandle);

  List<Passkey> findAllByUser_Uid(int uid);
}
