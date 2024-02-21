import axios from "axios";
import React, {useState} from "react";
import {Alert, Button, ButtonGroup, Form, ListGroup} from "react-bootstrap";
import {changeBit, getBit} from "../../../service/bitmask";

function IonIdChangPrivilege() {
  const [usrLoaded, setUsrLoaded] = useState(false);
  const [id, setId] = useState('');
  const [up, setUp] = useState(0);
  const [ws, setWs] = useState(-1);
  const [wr, setWr] = useState<string[]>([]);

  function load() {
    axios.get('/manage/api/privilege/get', {
      params: {id: id}
    })
      .then(res => {
        setUp(res.data['result']);
        setUsrLoaded(true);
        setWs(1);
      })
      .catch(err => {
        switch (err.response?.data['result']) {
          case 1:
            setWs(2);
            break;
          case 2:
            setWs(3);
            break;
          default:
            setWs(5);
        }
      });
  }

  function set() {
    axios.patch('/manage/api/privilege/patch', {
      id: id,
      pr: up
    })
      .then(res => {
        setWs(0);
        setWr([
          res.data['result']['id'],
          res.data['result']['pr'],
        ])
      })
      .catch(err => {
        switch (err.response?.data['result']) {
          case 1:
            setWs(2);
            break;
          case 2:
            setWs(3);
            break;
          case 3:
            setWs(4);
            break;
          default:
            setWs(5);
        }
      });
  }

  return (
    <div className="w-50 mgw">
      <Form.Group className="mb-2">
        <Form.Control
          type="text"
          placeholder="IonID"
          value={id}
          onChange={e => setId(e.target.value)}
        />
        <Form.Group className="my-2">
          <Form.Check
            inline
            label='USER'
            id='pu'
            disabled={!usrLoaded}
            checked={getBit(up, 0) === 1}
            onChange={() => setUp(changeBit(up, 0))}
          />
          <Form.Check
            inline
            label='FACULTY'
            id='pf'
            disabled={!usrLoaded}
            checked={getBit(up, 1) === 1}
            onChange={() => setUp(changeBit(up, 1))}
          />
          <Form.Check
            inline
            label='SUPERVISOR'
            id='pr'
            disabled={!usrLoaded}
            checked={getBit(up, 2) === 1}
            onChange={() => setUp(changeBit(up, 2))}
          />
        </Form.Group>
        <ButtonGroup>
          <Button variant="outline-primary" onClick={load}>Load</Button>
          <Button variant="outline-primary" onClick={set}>Set</Button>
        </ButtonGroup>
      </Form.Group>
      {ws === 0 &&
        <Alert variant="success">"{wr[0]}"의 권한을 "{wr[1]}"로 수정했습니다.</Alert>
      }
      {ws === 1 &&
        <Alert variant="success">권한을 불러왔습니다.</Alert>
      }
      {ws === 2 &&
        <Alert variant="danger">권한이 부족합니다.</Alert>
      }
      {ws === 3 &&
        <Alert variant="danger">해당 IonID가 없습니다.</Alert>
      }
      {ws === 4 &&
        <Alert variant="danger">자신의 권한은 수정할 수 없습니다.</Alert>
      }
      {ws === 5 &&
        <Alert variant="danger">문제가 발생했습니다.</Alert>
      }

      <ListGroup className="mt-3">
        <ListGroup.Item><span className="fw-bold">USER(1)</span>: IonID 사용</ListGroup.Item>
        <ListGroup.Item><span className="fw-bold">FACULTY(2)</span>: IonID 활성화, 조회 / 면불 승인 추가
          삭제</ListGroup.Item>
        <ListGroup.Item><span className="fw-bold">SUPERVISOR(4)</span>: IonID 권한 수정 / 교사로 등록</ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default IonIdChangPrivilege;
