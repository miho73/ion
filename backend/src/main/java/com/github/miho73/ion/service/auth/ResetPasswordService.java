package com.github.miho73.ion.service.auth;

import com.github.miho73.ion.dto.ResetPasswordReq;
import com.github.miho73.ion.dto.User;
import com.github.miho73.ion.repository.ResetPasswordRepository;
import com.github.miho73.ion.service.ionid.UserService;
import com.github.miho73.ion.utils.RandomCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class ResetPasswordService {
    final
    PasswordEncoder passwordEncoder;

    final
    UserService userService;

    final
    ResetPasswordRepository resetPasswordRepository;

    final
    RandomCode randomCode;

    public ResetPasswordService(RandomCode randomCode, ResetPasswordRepository resetPasswordRepository, UserService userService, PasswordEncoder passwordEncoder) {
        this.randomCode = randomCode;
        this.resetPasswordRepository = resetPasswordRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public int getState(String id) {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isEmpty()) return 2;
        User user = userOptional.get();
        Optional<ResetPasswordReq> rpq = resetPasswordRepository.findByUuid(user.getUid());
        if (rpq.isEmpty()) return 0;
        else return 3;
    }

    public boolean checkExistsForUser(int uid) {
        return resetPasswordRepository.findByUuid(uid).isPresent();
    }

    public void createRequest(int uid) {
        ResetPasswordReq rpq = new ResetPasswordReq();
        rpq.setUuid(uid);
        rpq.setStatus(ResetPasswordReq.RESET_PWD_STATUS.REQUESTED);
        rpq.setRequestDate(LocalDate.now());
        resetPasswordRepository.save(rpq);
    }

    public Optional<ResetPasswordReq> getRequest(int uid) {
        return resetPasswordRepository.findByUuid(uid);
    }

    public void acceptRequest(int uid, boolean accept) {
        if (accept) resetPasswordRepository.acceptRequest(uid);
        else resetPasswordRepository.rejectRequest(uid);
    }

    public Optional<ResetPasswordReq> getRequestByUid(int uid) {
        return resetPasswordRepository.findById(uid);
    }

    public Optional<ResetPasswordReq> getRequestByRandUrl(String token) {
        return resetPasswordRepository.findByRandUrl(token);
    }
}
