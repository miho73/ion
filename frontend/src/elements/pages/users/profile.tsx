import {Tab, Tabs} from "react-bootstrap";
import React from "react";
import GeneralSettings from "./general";
import SecuritySettings from "./security/security";

function ProfilePage() {
  return (
    <>
      <h1>프로필</h1>
      <Tabs className={'my-2'}>
        <Tab title={'일반'} eventKey={'generals'}>
          <GeneralSettings/>
        </Tab>
        <Tab title={'보안'} eventKey={'security'}>
          <SecuritySettings/>
        </Tab>
      </Tabs>
    </>
  );
}

export default ProfilePage;
