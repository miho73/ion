package com.github.miho73.ion.dto;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Entity
@Data
@NoArgsConstructor
@Accessors(chain = true)
@Table(schema = "auth", name = "passkey_user_handle")
public class PasskeyUserHandle {
  @OneToOne
  @JoinColumn(name = "uuid", referencedColumnName = "uid")
  private User user;

  @Id
  @Column(name = "user_handle", nullable = false, length = 32)
  private byte[] userHandle;
}
