package com.github.miho73.ion.service.auth;

import com.github.miho73.ion.dto.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  final
  PasswordEncoder passwordEncoder;

  public AuthService(PasswordEncoder passwordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * @param pwd  password to match
   * @param user user to check
   * @return true: matches, false: not matches.
   */
  public boolean authenticate(String pwd, User user) {
    return passwordEncoder.matches(pwd, user.getPwd());
  }

  /**
   * @param user user to check
   * @return 0: approved, 1: inactivated, 2: banned
   */
  public int checkActiveStatus(User user) {
    User.USER_STATUS status = user.getStatus();
    return switch (status) {
      case ACTIVATED -> 0;
      case INACTIVATED -> 1;
      case BANNED -> 2;
    };
  }
}
