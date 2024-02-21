import React from 'react'
import {Container, Row} from 'react-bootstrap';
import Promote from './promote';
import SetDefaultState from "./defaultState";

function BulkActions() {
  return (
    <Container className="p-3">
      <p className='fs-3 fw-bold text-danger m-0'>DANGER ZONE</p>
      <hr/>
      <Row className="my-3">
        <h2 className="mb-3">진급</h2>
        <Promote/>
      </Row>
      <Row className="my-3">
        <h2 className="mb-3">IonID 기본 상태 설정</h2>
        <SetDefaultState/>
      </Row>
    </Container>
  );
}

export default BulkActions;
