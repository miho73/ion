import React from "react";
import {Stack} from "react-bootstrap";
import IonIdActivation from "./idActivation";
import QueryIonId from "./queryIonId";
import IonIdChangPrivilege from "./changePrivilege";
import RemoveGrade from "./removeGrade";
import AcceptPwdChange from "./acceptPwdChange";

function IonIdManage() {
  return (
    <Stack gap={4}>
      <QueryIonId/>
      <IonIdActivation/>
      <IonIdChangPrivilege/>
      <AcceptPwdChange/>
      <RemoveGrade/>
    </Stack>
  );
}

export default IonIdManage;
