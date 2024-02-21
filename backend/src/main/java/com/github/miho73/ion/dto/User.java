package com.github.miho73.ion.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@Table(schema = "users", name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int uid;

  @Length(min = 1, message = "id too short")
  @Length(max = 10, message = "id too long")
  @Column(name = "name", nullable = false)
  private String name;

  @Min(value = 0, message = "grade not in range")
  @Max(value = 3, message = "grade not in range")
  @Column(name = "grade", nullable = false)
  private int grade;

  @Min(value = 0, message = "class not in range")
  @Max(value = 4, message = "class not in range")
  @Column(name = "clas", nullable = false)
  private int clas;

  @Min(value = 0, message = "scode not in range")
  @Max(value = 24, message = "scode not in range")
  @Column(name = "scode", nullable = false)
  private int scode;

  @Column(name = "scode_cflag", nullable = false)
  private boolean scodeCFlag;

  @Length(min = 1, message = "{validation.id.too_short}")
  @Length(max = 30, message = "{validation.id.too_long}")
  @Column(name = "id", nullable = false)
  private String id;

  @Column(name = "pwd", nullable = false)
  private String pwd;

  @Column(name = "last_login")
  private Timestamp lastLogin;

  @Column(name = "join_date", nullable = false)
  private Timestamp joinDate;

  @Column(name = "status", nullable = false)
  private USER_STATUS status;

  @Column(name = "privilege", nullable = false)
  private int privilege;

  public enum USER_STATUS {
    INACTIVATED,
    ACTIVATED,
    BANNED
  }
}
