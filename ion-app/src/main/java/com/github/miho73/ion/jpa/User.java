package com.github.miho73.ion.jpa;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@Table(schema = "users", name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uid;

    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Column(name = "id", length = 50, nullable = false)
    private String id;

    @Column(name = "password", length = 100, nullable = false)
    private String password;

    @Column(name = "last_login")
    private Timestamp lastLogin;

    @Column(name = "join_date")
    private Timestamp joinDate;

    @Column(name = "grade", nullable = false)
    private int grade;
    @Column(name = "classroom", nullable = false)
    private int classroom;
    @Column(name = "student_code", nullable = false)
    private int studentCode;

    @Column(name = "status", nullable = false)
    private USER_STATUS status;

    public enum USER_STATUS {
        UNCERTIFIED,
        NORMAL,
        BLOCKED
    }
}
