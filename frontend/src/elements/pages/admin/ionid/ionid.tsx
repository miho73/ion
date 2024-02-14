import React from "react";
import {Container, Row} from "react-bootstrap";
import IonIdActivation from "./idActivation";
import QueryIonId from "./queryIonId";
import IonIdChangPrivilege from "./changeState";
import RemoveGrade from "./removeGrade";
import AcceptPwdChange from "./acceptPwdChange";

function IonIdManage() {
    return (
        <Container className="p-3">
            <Row className="my-3">
                <h2 className="mb-3">IonID 조회</h2>
                <QueryIonId/>
            </Row>
            <hr/>
            <Row className="my-3">
                <h2 className="mb-3">IonID 활성화</h2>
                <IonIdActivation/>
            </Row>
            <hr/>
            <Row className="my-3">
                <h2 className="mb-3">IonID 권한 변경</h2>
                <IonIdChangPrivilege/>
            </Row>
            <hr/>
            <Row className="my-3">
                <h2 className="mb-3">암호 재설정 확인</h2>
                <AcceptPwdChange/>
            </Row>
            <hr/>
            <Row className="my-3">
                <h2 className="mb-3">교사로 등록</h2>
                <RemoveGrade/>
            </Row>
        </Container>
    );
}

export default IonIdManage;