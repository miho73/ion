package com.github.miho73.ion.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@Accessors(chain = true)
@Table(schema = "auth", name = "passkey_store")
public class Passkey {
    @Id
    @Column(name = "cred_id", nullable = false)
    private byte[] credId;

    @ManyToOne
    @JoinColumn(name = "uuid", referencedColumnName = "uid")
    @NotNull
    private User user;

    @Column(name = "user_handle", nullable = false, length = 32)
    private byte[] userHandle;

    @Column(name = "public_key", nullable = false)
    private byte[] publicKey;

    @Column(name = "signature_counter", nullable = false)
    @ColumnDefault("0")
    private long counter;

    @Column(name = "last_use")
    private Timestamp lastUse;
}
