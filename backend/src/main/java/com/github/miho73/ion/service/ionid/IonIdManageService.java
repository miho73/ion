package com.github.miho73.ion.service.ionid;

import com.github.miho73.ion.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class IonIdManageService {
    final
    UserRepository userRepository;

    public IonIdManageService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void updateActiveState(String id, int status) {
        log.info("IonID set status. id=" + id + ", status=" + status);
        userRepository.updateActiveById(id, status);
    }
}
