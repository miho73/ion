import React, {useEffect, useState} from "react";
import {Container, Tab, Tabs} from "react-bootstrap";
import IonIdManage from "./ionid/ionid";
import NsManage from "./ns/ns";
import {checkPrivilege} from "../../service/auth";
import {useNavigate} from "react-router-dom";
import CannotAuthorize from '../auth/cannotAuth';
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
        return <CannotAuthorize/>
    }

    return (
        <Container className='mt-4'>
            <h1>Ion Management</h1>
            <Tabs defaultActiveKey='ns'>
                <Tab eventKey='ns' title='면학 불참'>
                    <NsManage/>
                </Tab>
                <Tab eventKey='ionid' title='IonID'>
                    <IonIdManage/>
                </Tab>
                <Tab eventKey='' title='학년 변경'>
                    <BulkActions/>
                </Tab>
            </Tabs>
        </Container>
    )
}

export default ManagementPage;