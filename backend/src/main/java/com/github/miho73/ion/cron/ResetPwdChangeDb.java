package com.github.miho73.ion.cron;

import com.github.miho73.ion.repository.ResetPasswordRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ResetPwdChangeDb {
    final
    ResetPasswordRepository resetPasswordRepository;

    public ResetPwdChangeDb(ResetPasswordRepository resetPasswordRepository) {
        log.info("Password reset cron scheduled");
        this.resetPasswordRepository = resetPasswordRepository;
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void resetDb() {
        resetPasswordRepository.truncateTable();
        log.info("Password reset table truncated");
    }
}
