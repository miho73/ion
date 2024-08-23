import React, {useEffect, useState} from 'react';
import {Col, ListGroup, ListGroupItem, Row, Stack} from 'react-bootstrap';
import {Link} from 'react-router-dom';


function Dintro() {
  const [markdown, setMarkdown] = useState('');


  return (
    <>
      <Row className="align-items-md-stretch">
        <Col className="col-md-6 mb-3">
          <Stack className="h-100 p-5 bg-light border rounded-3" gap={3}>
            <h2>학생용</h2>
            <p>학생들이 Ion을 잘 활용하여 학습에 도움이 될 수 있도록 합니다.</p>
            <Link className="btn btn-outline-dark" to='/docs/introduction/student/choose'>Go</Link>
          </Stack>
        </Col>
        <Col className="col-md-6 mb-3">
          <Stack className="h-100 p-5 bg-light border rounded-3" gap={3}>
            <h2>교사용</h2>
            <p>교사가 Ion을 잘 활용하여 학생들의 면불을 관리하기 편하도록 합니다.</p>
            <Link className="btn btn-outline-dark" to='/docs/introduction/teacher/choose'>Go</Link>
          </Stack>
        </Col>
      </Row>
    </>
  );
}

export default Dintro
