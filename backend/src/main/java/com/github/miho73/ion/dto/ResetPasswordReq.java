package com.github.miho73.ion.dto;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(schema = "auth", name = "reset_pwd_req")
public class ResetPasswordReq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uid;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(name = "status", nullable = false)
    private RESET_PWD_STATUS status;

    @Column(name = "uuid", nullable = false)
    private int uuid;

    @Length(min = 1, max = 60, message = "invalid private code")
    @Column(name = "private_code")
    private String privateCode;

    @Length(min = 128, max = 128, message = "invalid randUrl")
    @Column(name = "rand_url", unique = true, length = 128)
    private String randUrl;

    public enum RESET_PWD_STATUS {
        REQUESTED, // not seen private code yet
        WAITING, // seen private code
        APPROVED,
        DENIED,
        CLOSED
    }
}
