import React, {useEffect, useState} from 'react';
import {Col, ListGroup, ListGroupItem, Row, Stack} from 'react-bootstrap';
import {Link} from 'react-router-dom';


function DteacherChooseHelp() {
  const [markdown, setMarkdown] = useState('');


  return (
    <>
      <Row className="align-items-md-stretch">
        <Col className="col-md-6 mb-3">
          <Stack className="h-100 p-5 bg-light border rounded-3" gap={3}>
            <h2>IonID</h2>
            <p>IonID 조회 및 활성화, 권한 변경, 암호 재설정 및 교사로 등록과 관련된 정보가 담겨져 있습니다.</p>
            <Link className="btn btn-outline-dark" to='/docs/introduction/teacher/IonID'>Go</Link>
          </Stack>
        </Col>
        <Col className="col-md-6 mb-3">
          <Stack className="h-100 p-5 bg-light border rounded-3" gap={3}>
            <h2>면학 불참</h2>
            <p>면불 승인 / 거절, 면불 목록 조회 및 추가 / 확인, 면불 시간 구성과 관련된 정보가 담겨져 있습니다.</p>
            <Link className="btn btn-outline-dark" to='/docs/introduction/teacher/noMB'>Go</Link>
          </Stack>
        </Col>
      </Row>
      <Row className="align-items-md-stretch">
        <Col className="col-md-6 mb-3">
          <Stack className="h-100 p-5 bg-light border rounded-3" gap={3}>
            <h2>DANGER ZONE</h2>
            <p>진급, IonID 기본 상태 설정과 같은 조심해서 사용해야 하는 기능과 관련된 정보가 담겨져 있습니다.</p>
            <Link className="btn btn-outline-dark" to='/docs/introduction/teacher/dangerZone'>Go</Link>
          </Stack>
        </Col>
      </Row>
    </>
  );
}

export default DteacherChooseHelp
