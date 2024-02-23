import {Tab, Tabs} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import GeneralSettings from "./general";
import SecuritySettings from "./security/security";
import {isLogin} from "../../service/auth";
import {useNavigate} from "react-router-dom";

function ProfilePage() {
  const [loginState, setLoginState] = useState(-1);

  useEffect(() => {
    isLogin(setLoginState);
  }, []);

  const navigate = useNavigate();

  if(loginState === -1) return <></>;
  if(loginState === 1) {
    navigate('/');
  }

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
