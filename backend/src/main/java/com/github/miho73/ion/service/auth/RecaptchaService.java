package com.github.miho73.ion.service.auth;

import com.github.miho73.ion.dto.RecaptchaReply;
import com.google.cloud.recaptchaenterprise.v1.RecaptchaEnterpriseServiceClient;
import com.google.recaptchaenterprise.v1.*;
import com.google.recaptchaenterprise.v1.RiskAnalysis.ClassificationReason;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Vector;

@Service
@Slf4j
public class RecaptchaService {
  @Value("${ion.recaptcha.project-id}")
  String projectId;
  @Value("${ion.recaptcha.site-key}")
  String recaptchaSiteKey;
  @Value("${ion.recaptcha.checkbox-site-key}")
  String recaptchaCheckboxSiteKey;
  @Value("${ion.recaptcha.bypass}")
  boolean bypassRecaptcha;

  RecaptchaEnterpriseServiceClient client;

  @PostConstruct
  public void init() throws IOException {
    client = RecaptchaEnterpriseServiceClient.create();
  }

  public RecaptchaReply performAssessment(String token, String recaptchaAction, boolean isCheckbox) throws IOException {
    log.info("recaptcha assessment requested. action=" + recaptchaAction + " isV2=" + isCheckbox);
    if (bypassRecaptcha && token.equals("bypass")) {
      log.info("recaptcha bypassed!");
      RecaptchaReply rr = new RecaptchaReply();
      rr.setOk(true);
      rr.setScore(1.0f);
      rr.setAssessmentName("bypass");
      return rr;
    }
    return createAssessment(projectId, isCheckbox ? recaptchaCheckboxSiteKey : recaptchaSiteKey, token, recaptchaAction);
  }

  /**
   * Create an assessment to analyze the risk of an UI action. Assessment approach is the same for
   * both 'score' and 'checkbox' type recaptcha site keys.
   *
   * @param projectID        : GCloud Project ID
   * @param recaptchaSiteKey : Site key obtained by registering a domain/app to use recaptcha
   *                         services. (score/ checkbox type)
   * @param token            : The token obtained from the client on passing the recaptchaSiteKey.
   * @param recaptchaAction  : Action name corresponding to the token.
   */
  public RecaptchaReply createAssessment(
    String projectID, String recaptchaSiteKey, String token, String recaptchaAction)
    throws IOException {
    RecaptchaReply rr = new RecaptchaReply();

    // Set the properties of the event to be tracked.
    Event event = Event.newBuilder().setSiteKey(recaptchaSiteKey).setToken(token).build();

    // Build the assessment request.
    CreateAssessmentRequest createAssessmentRequest =
      CreateAssessmentRequest.newBuilder()
        .setParent(ProjectName.of(projectID).toString())
        .setAssessment(Assessment.newBuilder().setEvent(event).build())
        .build();

    Assessment response = client.createAssessment(createAssessmentRequest);

    // Check if the token is valid.
    if (!response.getTokenProperties().getValid()) {
      log.error(
        "The CreateAssessment call failed because the token was: "
          + response.getTokenProperties().getInvalidReason().name());
      rr.setOk(false);
      return rr;
    }

    // Check if the expected action was executed.
    // (If the key is checkbox type and 'action' attribute wasn't set, skip this check.)
    if (!response.getTokenProperties().getAction().equals(recaptchaAction)) {
      log.error(
        "captcha failed: "
          + response.getTokenProperties().getAction());
      log.error(
        "recaptcha action mismatch: "
          + recaptchaAction);
      rr.setOk(false);
      return rr;
    }

    rr.setOk(true);
    List<String> reasons = new Vector<>();

    // Get the reason(s) and the risk score.
    for (ClassificationReason reason : response.getRiskAnalysis().getReasonsList()) {
      reasons.add(reason.toString());
    }
    rr.setReasons(reasons);

    float recaptchaScore = response.getRiskAnalysis().getScore();
    rr.setScore(recaptchaScore);

    // Get the assessment name (id). Use this to annotate the assessment.
    String assessmentName = response.getName();
    rr.setAssessmentName(assessmentName.substring(assessmentName.lastIndexOf("/") + 1));

    log.info("recaptcha success. assessmentId=" + rr.getAssessmentName() + " score=" + rr.getScore());
    return rr;
  }

  /**
   * Send an assessment comment
   *
   * @param assessmentId : Assessment id to comment
   * @param type         : true when it's legal. false when it's illegal
   * @return true when success otherwise, false
   */
  public boolean addAssessmentComment(String assessmentId, boolean type) throws IOException {
    if (bypassRecaptcha && assessmentId.equals("bypass")) {
      log.info("recaptcha annotation bypassed!");
      return true;
    }

    if (type) return addLegitimateAnnotation(assessmentId);
    else return addSuspiciousAnnotation(assessmentId);
  }

  private boolean addSuspiciousAnnotation(String assessmentId) throws IOException {
    try (RecaptchaEnterpriseServiceClient client = RecaptchaEnterpriseServiceClient.create()) {
      AnnotateAssessmentRequest annotateAssessmentRequest =
        AnnotateAssessmentRequest.newBuilder()
          .setName(AssessmentName.of(projectId, assessmentId).toString())
          .setAnnotation(AnnotateAssessmentRequest.Annotation.FRAUDULENT)
          .build();

      AnnotateAssessmentResponse response = client.annotateAssessment(annotateAssessmentRequest);
      log.info("recaptcha fraudulent annotation success. assessmentId=" + assessmentId);
    }
    return true;
  }

  private boolean addLegitimateAnnotation(String assessmentId) throws IOException {
    try (RecaptchaEnterpriseServiceClient client = RecaptchaEnterpriseServiceClient.create()) {
      AnnotateAssessmentRequest annotateAssessmentRequest =
        AnnotateAssessmentRequest.newBuilder()
          .setName(AssessmentName.of(projectId, assessmentId).toString())
          .setAnnotation(AnnotateAssessmentRequest.Annotation.LEGITIMATE)
          .build();

      AnnotateAssessmentResponse response = client.annotateAssessment(annotateAssessmentRequest);
      log.info("recaptcha Legitimate comment success. assessmentId=" + assessmentId);
    }
    return true;
  }
}
