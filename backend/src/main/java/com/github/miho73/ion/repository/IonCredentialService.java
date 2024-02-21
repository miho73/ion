package com.github.miho73.ion.repository;

import com.github.miho73.ion.dto.Passkey;
import com.github.miho73.ion.dto.PasskeyUserHandle;
import com.github.miho73.ion.dto.User;
import com.yubico.webauthn.CredentialRepository;
import com.yubico.webauthn.RegisteredCredential;
import com.yubico.webauthn.data.ByteArray;
import com.yubico.webauthn.data.PublicKeyCredentialDescriptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class IonCredentialService implements CredentialRepository {
  @Autowired
  private PasskeyUserHandleRepository passkeyUserHandleRepository;

  @Autowired
  private PasskeyRepository passkeyRepository;

  @Autowired
  private UserRepository userRepository;

  @Override
  public Set<PublicKeyCredentialDescriptor> getCredentialIdsForUsername(String s) {
    Optional<User> userOptional = userRepository.findById(s);
    if (userOptional.isEmpty()) return new HashSet<>();

    User user = userOptional.get();
    List<Passkey> passkeys = passkeyRepository.findAllByUser(user);

    Set<PublicKeyCredentialDescriptor> ret = new HashSet<>();
    passkeys.forEach(passkey -> {
      PublicKeyCredentialDescriptor pkcd = PublicKeyCredentialDescriptor.builder()
        .id(new ByteArray(passkey.getCredId()))
        .build();
      ret.add(pkcd);
    });
    return ret;
  }

  @Override
  public Optional<ByteArray> getUserHandleForUsername(String s) {
    Optional<User> userOptional = userRepository.findById(s);
    if (userOptional.isEmpty()) return Optional.empty();

    User user = userOptional.get();
    Optional<PasskeyUserHandle> passkeyUserHandleOptional = passkeyUserHandleRepository.findByUser(user);
    return passkeyUserHandleOptional.map(passkeyUserHandle -> new ByteArray(passkeyUserHandle.getUserHandle()));

  }

  @Override
  public Optional<String> getUsernameForUserHandle(ByteArray byteArray) {
    Optional<PasskeyUserHandle> passkeyUserHandleOptional = passkeyUserHandleRepository.findById(byteArray.getBytes());
    return passkeyUserHandleOptional.map(passkeyUserHandle -> passkeyUserHandle.getUser().getId());
  }

  @Override
  public Optional<RegisteredCredential> lookup(ByteArray credId, ByteArray userHandle) {
    Optional<Passkey> passkeyOptional = passkeyRepository.findByCredIdAndUserHandle(credId.getBytes(), userHandle.getBytes());
    if (passkeyOptional.isEmpty()) return Optional.empty();
    Passkey passkey = passkeyOptional.get();

    return Optional.of(RegisteredCredential.builder()
      .credentialId(new ByteArray(passkey.getCredId()))
      .userHandle(new ByteArray(passkey.getUserHandle()))
      .publicKeyCose(new ByteArray(passkey.getPublicKey()))
      .build());
  }

  @Override
  public Set<RegisteredCredential> lookupAll(ByteArray credId) {
    List<Passkey> passkeys = passkeyRepository.findAllById(Set.of(credId.getBytes()));

    Set<RegisteredCredential> ret = new HashSet<>(Set.of());
    passkeys.forEach(passkey -> {
      RegisteredCredential rc = RegisteredCredential.builder()
        .credentialId(new ByteArray(passkey.getCredId()))
        .userHandle(new ByteArray(passkey.getUserHandle()))
        .publicKeyCose(new ByteArray(passkey.getPublicKey()))
        .build();
      ret.add(rc);
    });

    return ret;
  }
}
