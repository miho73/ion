package com.github.miho73.ion.config;

import com.github.miho73.ion.repository.IonCredentialService;
import com.yubico.webauthn.RelyingParty;
import com.yubico.webauthn.data.RelyingPartyIdentity;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class IonRelyingParty {
  @Autowired
  IonCredentialService credentialService;

  @Value("${ion.passkey.relying-party.rpId}")
  String rpId;

  @Value("${ion.passkey.relying-party.rpName}")
  String rpName;

  @Value("${ion.passkey.relying-party.origin}")
  String origin;

  RelyingPartyIdentity identity;
  public RelyingParty rp;

  @PostConstruct
  public void init() {
    identity = RelyingPartyIdentity.builder()
      .id(rpId)
      .name(rpName)
      .build();

    rp = RelyingParty.builder()
      .identity(identity)
      .credentialRepository(credentialService)
      .origins(new HashSet<>(Set.of(origin)))
      .build();
  }

}
