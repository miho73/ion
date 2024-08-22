import React, {useEffect, useState} from 'react';
import {Col, ListGroup, ListGroupItem, Row, Stack} from 'react-bootstrap';
import {Link} from 'react-router-dom';


function DstudentChooseHelp() {
  const [markdown, setMarkdown] = useState('');


  return (
    <>
      <Row className="align-items-md-stretch">
        <Col className="col-md-6 mb-3">
          <Stack className="h-100 p-5 bg-light border rounded-3" gap={3}>
            <h2>IonID</h2>
            <p>IonID 생성 및 활성화, 복구, 학번 업데이트에 관련된 정보가 담겨 있습니다.</p>
            <Link className="btn btn-outline-dark" to='/docs/introduction/student/IonID'>Go</Link>
          </Stack>
        </Col>
        <Col className="col-md-6 mb-3">
          <Stack className="h-100 p-5 bg-light border rounded-3" gap={3}>
            <h2>면학 불참</h2>
            <p>면불 신청, 면불 승인 / 거절, 노트북실 면불 신청, 면불 취소 / 변경과 관련된 정보가 담겨 있습니다.</p>
            <Link className="btn btn-outline-dark" to='/docs/introduction/student/noMB'>Go</Link>
          </Stack>
        </Col>
      </Row>
      <Row className="align-items-md-stretch">
        <Col className="col-md-6 mb-3">
          <Stack className="h-100 p-5 bg-light border rounded-3" gap={3}>
            <h2>여담</h2>
            <p>영어 단어 학습 및 기타 기능에 관련된 정보가 담겨 있습니다.</p>
            <Link className="btn btn-outline-dark" to='/docs/introduction/student/digression'>Go</Link>
          </Stack>
        </Col>
      </Row>
    </>
  );
}

export default DstudentChooseHelp
