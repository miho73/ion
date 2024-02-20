package com.github.miho73.ion.service.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.miho73.ion.config.IonRelyingParty;
import com.github.miho73.ion.dto.Passkey;
import com.github.miho73.ion.dto.PasskeyUserHandle;
import com.github.miho73.ion.dto.User;
import com.github.miho73.ion.exceptions.IonException;
import com.github.miho73.ion.repository.PasskeyRepository;
import com.github.miho73.ion.repository.PasskeyUserHandleRepository;
import com.github.miho73.ion.repository.UserRepository;
import com.yubico.webauthn.*;
import com.yubico.webauthn.data.*;
import com.yubico.webauthn.exception.AssertionFailedException;
import com.yubico.webauthn.exception.InvalidSignatureCountException;
import com.yubico.webauthn.exception.RegistrationFailedException;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
public class PasskeyService {
    final
    IonRelyingParty rp;

    final
    UserRepository userRepository;

    final
    SessionService sessionService;

    final
    PasskeyUserHandleRepository passkeyUserHandleRepository;

    final
    PasskeyRepository passkeyRepository;

    final
    AuthService authService;

    Random random = new Random();

    public PasskeyService(IonRelyingParty rp, UserRepository userRepository, SessionService sessionService, PasskeyUserHandleRepository passkeyUserHandleRepository, PasskeyRepository passkeyRepository, AuthService authService) {
        this.rp = rp;
        this.userRepository = userRepository;
        this.sessionService = sessionService;
        this.passkeyUserHandleRepository = passkeyUserHandleRepository;
        this.passkeyRepository = passkeyRepository;
        this.authService = authService;
    }

    public Optional<JSONObject> credentialCreateJson(HttpSession session, int uid) throws JsonProcessingException {
        Optional<User> userOptional = userRepository.findById(uid);
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }
        User user = userOptional.get();

        PublicKeyCredentialCreationOptions options = rp.rp.startRegistration(
            StartRegistrationOptions.builder()
                .user(getUserIdentity(user))
                .build()
        );
        session.setAttribute("publicKeyCredentialCreationOptions", options.toJson());
        return Optional.of(new JSONObject(options.toCredentialsCreateJson()));
    }

    UserIdentity getUserIdentity(User user) {
        Optional<PasskeyUserHandle> userHandleOptional = passkeyUserHandleRepository.findByUser(user);

        if (userHandleOptional.isEmpty()) {
            byte[] userHandle = new byte[32];
            random.nextBytes(userHandle);

            PasskeyUserHandle passkeyUserHandle = new PasskeyUserHandle()
                .setUser(user)
                .setUserHandle(userHandle);
            passkeyUserHandleRepository.save(passkeyUserHandle);

            return UserIdentity.builder()
                .name(user.getId())
                .displayName(user.getName())
                .id(new ByteArray(userHandle))
                .build();
        }
        PasskeyUserHandle userHandle = userHandleOptional.get();
        return UserIdentity.builder()
            .name(user.getId())
            .displayName(user.getName())
            .id(new ByteArray(userHandle.getUserHandle()))
            .build();
    }

    public boolean completeRegistration(HttpSession session, String publicKeyCredentialJson) throws IOException {
        PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> pkc = PublicKeyCredential.parseRegistrationResponseJson(publicKeyCredentialJson);

        String optionsJson = (String) session.getAttribute("publicKeyCredentialCreationOptions");
        PublicKeyCredentialCreationOptions request = PublicKeyCredentialCreationOptions.fromJson(optionsJson);

        try {
            RegistrationResult result = rp.rp.finishRegistration(FinishRegistrationOptions.builder()
                .request(request)
                .response(pkc)
                .build());

            byte[] requestedUserHandle = request.getUser().getId().getBytes();
            Optional<PasskeyUserHandle> actualUserHandle = passkeyUserHandleRepository.findByUser_Uid(
                sessionService.getUid(session)
            );

            if (actualUserHandle.isEmpty() || !Arrays.equals(requestedUserHandle, actualUserHandle.get().getUserHandle())) {
                log.warn("Passkey final registration failed. UserHandle does not match");
                return false;
            }

            if (result.isUserVerified()) {
                log.info("Registration success. register passkey: {}", result.getKeyId());

                Passkey passkey = new Passkey()
                    .setUserHandle(requestedUserHandle)
                    .setPublicKey(result.getPublicKeyCose().getBytes())
                    .setCounter(result.getSignatureCount())
                    .setCredId(result.getKeyId().getId().getBytes())
                    .setUser(actualUserHandle.get().getUser());

                passkeyRepository.save(passkey);
                return true;
            } else {
                return false;
            }
        } catch (RegistrationFailedException e) {
            log.warn("Registration failed", e);
            return false;
        } catch (IonException e) {
            log.warn("Registration failed(uid was not discovered in session)", e);
            return false;
        }
    }

    public JSONObject startAssertion(HttpSession session) throws JsonProcessingException {
        AssertionRequest request = rp.rp.startAssertion(
            StartAssertionOptions.builder()
                .build()
        );
        session.setAttribute("passkeyAuthenticationRequest", request.toJson());
        String assertionOptions = request.toCredentialsGetJson();
        return new JSONObject(assertionOptions);
    }

    /**
     * @return 0: authenticated
     * 1: request was not found from session
     * 2: signature counter is not valid
     * 3: authentication failed
     * 4: passkey not found
     * 5: user not found
     * 6: user inactive
     * 7: user banned
     * 8: user unknown status
     * 9: scode change
     */
    public int completeAuthentication(HttpSession session, String publicKeyCredentialJson) throws IOException {
        PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> pkc = PublicKeyCredential.parseAssertionResponseJson(publicKeyCredentialJson);

        try {
            if (session.getAttribute("passkeyAuthenticationRequest") == null) {
                return 1;
            }
            String requestJson = (String) session.getAttribute("passkeyAuthenticationRequest");
            AssertionRequest request = AssertionRequest.fromJson(requestJson);

            AssertionResult result = rp.rp.finishAssertion(FinishAssertionOptions.builder()
                .request(request)
                .response(pkc)
                .build());

            if (!result.isSuccess()) {
                return 3;
            }

            Optional<Passkey> passkey = passkeyRepository.findById(result.getCredential().getCredentialId().getBytes());

            if (passkey.isEmpty()) {
                return 4;
            } else {
                passkey.get().setCounter(result.getSignatureCount());
                passkey.get().setLastUse(new Timestamp(System.currentTimeMillis()));

                Optional<User> userOptional = userRepository.findById(passkey.get().getUser().getUid());

                if (userOptional.isEmpty()) {
                    log.warn("User not found. id=" + passkey.get().getUser().getUid());
                    return 5;
                }

                User user = userOptional.get();

                int active = authService.checkActiveStatus(user);
                if (active == 0) {
                    userOptional.get().setLastLogin(new Timestamp(System.currentTimeMillis()));
                    session.setAttribute("uid", user.getUid());
                    session.setAttribute("grade", user.getGrade());

                    if (user.isScodeCFlag()) {
                        log.info("via passkey. scode flag is true. user in schange mode. id=" + user.getId());
                        session.setAttribute("schange", true);
                        session.setAttribute("login", false);
                        return 9;
                    } else {
                        session.setAttribute("schange", false);
                        session.setAttribute("login", true);
                        session.setAttribute("id", user.getId());
                        session.setAttribute("name", user.getName());
                        session.setAttribute("priv", user.getPrivilege());
                        log.info("via passkey. session set. id=" + user.getId());
                    }
                    return 0;
                } else if (active == 1) {
                    log.info("login blocked(inactive). id=" + user.getId());
                    return 6;
                } else if (active == 2) {
                    log.info("login blocked(banned). id=" + user.getId());
                    return 7;
                } else {
                    log.info("login blocked(unknown status). id=" + user.getId());
                    return 7;
                }
            }
        } catch (InvalidSignatureCountException e) {
            return 2;
        } catch (AssertionFailedException e) {
            log.warn("Assertion failed", e);
            return 3;
        }
    }
}
