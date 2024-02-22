import axios from "axios";
import React, {useState} from "react";
import {Alert, Button, ButtonGroup, Form, ListGroup, Stack} from "react-bootstrap";
import {changeBit, getBit} from "../../../service/bitmask";
import {inRange} from "../../../service/checker";

function IonIdChangPrivilege() {
  const [usrLoaded, setUsrLoaded] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [up, setUp] = useState<number>(0);
  const [ws, setWs] = useState<number>(-1);
  const [wr, setWr] = useState<string[]>([]);
  const [formState, setFormState] = useState<number>(0);

  function load() {
    let state = 0;
    if (!inRange(4, 30, id.length)) state = changeBit(state, 0);
    setFormState(state);
    if (state !== 0) return;

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
    let state = 0;
    if (!inRange(4, 30, id.length)) state = changeBit(state, 0);
    setFormState(state);
    if (state !== 0) return;

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
    <Stack gap={1}>
      <h2>IonID 권한 변경</h2>
      <Form.Group className="input-mx-md">
        <Form.Control
          type="text"
          placeholder="IonID" aria-label="IonID"
          value={id}
          onChange={e => setId(e.target.value)}
          isInvalid={getBit(formState, 0) === 1}
        />
      </Form.Group>

      <Form.Group className={'my-1'}>
        <Form.Check
          inline
          label='USER' aria-label={'USER'}
          id='pu'
          disabled={!usrLoaded}
          checked={getBit(up, 0) === 1}
          onChange={() => setUp(changeBit(up, 0))}
        />
        <Form.Check
          inline
          label='FACULTY' aria-label={'FACULTY'}
          id='pf'
          disabled={!usrLoaded}
          checked={getBit(up, 1) === 1}
          onChange={() => setUp(changeBit(up, 1))}
        />
        <Form.Check
          inline
          label='SUPERVISOR' aria-label={'SUPERVISOR'}
          id='pr'
          disabled={!usrLoaded}
          checked={getBit(up, 2) === 1}
          onChange={() => setUp(changeBit(up, 2))}
        />
      </Form.Group>

      <ButtonGroup className={'align-self-baseline my-1'}>
        <Button variant="outline-primary" onClick={load}>Load</Button>
        <Button variant="outline-primary" onClick={set}>Set</Button>
      </ButtonGroup>

      {ws === 0 &&
        <Alert variant="success" className={'my-1'}>"{wr[0]}"의 권한을 "{wr[1]}"로 수정했습니다.</Alert>
      }
      {ws === 1 &&
        <Alert variant="success" className={'my-1'}>권한을 불러왔습니다.</Alert>
      }
      {ws === 2 &&
        <Alert variant="danger" className={'my-1'}>권한이 부족합니다.</Alert>
      }
      {ws === 3 &&
        <Alert variant="danger" className={'my-1'}>해당 IonID가 없습니다.</Alert>
      }
      {ws === 4 &&
        <Alert variant="danger" className={'my-1'}>자신의 권한은 수정할 수 없습니다.</Alert>
      }
      {ws === 5 &&
        <Alert variant="danger" className={'my-1'}>문제가 발생했습니다.</Alert>
      }

      <ListGroup className={'my-1'}>
        <ListGroup.Item><span className="fw-bold">USER(1)</span>: IonID 사용</ListGroup.Item>
        <ListGroup.Item><span className="fw-bold">FACULTY(2)</span>: IonID 활성화, 조회 / 면불 승인 추가
          삭제</ListGroup.Item>
        <ListGroup.Item><span className="fw-bold">SUPERVISOR(4)</span>: IonID 권한 수정 / 교사로 등록</ListGroup.Item>
      </ListGroup>
    </Stack>
  );
}

export default IonIdChangPrivilege;
