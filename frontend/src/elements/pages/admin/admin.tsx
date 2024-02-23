import React, {useEffect, useState} from "react";
import {Tab, Tabs} from "react-bootstrap";
import IonIdManage from "./ionid/ionid";
import NsManage from "./ns/ns";
import {checkPrivilege} from "../../service/auth";
import {useNavigate} from "react-router-dom";
import AuthError from '../auth/AuthError';
import BulkActions from "./bulk/bulkActions";

function ManagementPage() {
  const navigate = useNavigate();

  const [loginState, setLoginState] = useState(-1);
  useEffect(() => {
    checkPrivilege(setLoginState);
  }, []);

  if (loginState === -1) {
    return <></>;
  }
  if (loginState === 1) {
    navigate('/');
    return <></>;
  }
  if (loginState === 2) {
    return <AuthError/>
  }

  return (
    <>
      <h1>Ion Management</h1>
      <Tabs defaultActiveKey='ns' className={'my-2'}>
        <Tab eventKey='ns' title='면학 불참'>
          <NsManage/>
        </Tab>
        <Tab eventKey='ionid' title='IonID'>
          <IonIdManage/>
        </Tab>
        <Tab eventKey='' title='DANGER ZONE'>
          <BulkActions/>
        </Tab>
      </Tabs>
    </>
  )
}

export default ManagementPage;
