package com.github.miho73.ion.service;

import com.github.miho73.ion.Repository.UserRepository;
import com.github.miho73.ion.jpa.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Slf4j
@Service("UserService")
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        log.debug("Create new users");

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setJoinDate(new Timestamp(System.currentTimeMillis()));
        user.setStatus(User.USER_STATUS.UNCERTIFIED);
        return userRepository.save(user);
    }
}
