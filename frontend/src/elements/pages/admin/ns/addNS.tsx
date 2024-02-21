import React, {useState} from "react";
import {Alert, Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {changeBit, getBit} from "../../../service/bitmask";
import axios from "axios";
import {inRange} from "../../../service/checker";

type AddNsProps = {
  scode: number | undefined,
  setScode: (scode: number) => void,
  timePreset: number
}

function AddNs(props: AddNsProps) {
  const [revTime, setRevTime] = useState(-1);
  const [revPlace, setRevPlace] = useState('');
  const [revRes, setRevRes] = useState('');
  const [formState, setFormState] = useState(0);

  const [working, setWorking] = useState(false);
  const [workError, setWorkError] = useState(-1);

  const scode = props.scode;
  const setScode = props.setScode;
  const timePreset = props.timePreset;

  function exe() {
    let state = 0

    // validate
    if (!(
      timePreset === 0 && (
        revTime === 0 || revTime === 1 || revTime === 2
      ) ||
      timePreset === 1 && (
        revTime === 3 || revTime === 4 || revTime === 5 || revTime === 6
      )
    )) state = changeBit(state, 0);
    if (!inRange(1, 30, revPlace.length)) state = changeBit(state, 1);
    if (!inRange(1, 30, revRes.length)) state = changeBit(state, 3);

    setFormState(state);

    if (state !== 0) return;

    setWorking(true);
    axios.post('/manage/api/ns/create', {
      scode: scode,
      time: revTime,
      place: revPlace,
      reason: revRes
    })
      .then(res => {
        setWorkError(0);
      })
      .catch(err => {
        const es = err.response?.data['result'];
        switch (es) {
          case 1:
            setWorkError(1);
            break;
          case 2:
            setWorkError(2);
            break;
          case 3:
            setWorkError(3);
            break;
          case 4:
            setWorkError(4);
            break;
          default:
            setWorkError(6);
        }
      })
      .finally(() => {
        setWorking(false);
      });
  }

  return (
    <Row className="my-3">
      <h2 className="mb-3">면학 불참 추가</h2>
      <div>
        <Row className='mt-1'>
          <Form.Group as={Col} className='mb-3'>
            <Form.Label htmlFor='time' className='form-label'>면학</Form.Label>
            <Form.Select isInvalid={getBit(formState, 0) === 1} aria-label='면학 시간' disabled={working}
                         value={revTime} onChange={e => setRevTime(Number.parseInt(e.target.value))}>
              <option value={-1}>면학 시간</option>
              {timePreset === 0 &&
                <>
                  <option value={0}>8면</option>
                  <option value={1}>1면</option>
                  <option value={2}>2면</option>
                </>
              }
              {timePreset === 1 &&
                <>
                  <option value={3}>오후 1차</option>
                  <option value={4}>오후 2차</option>
                  <option value={5}>야간 1차</option>
                  <option value={6}>야간 2차</option>
                </>
              }
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} className='mb-3'>
            <Form.Label htmlFor='place' className='form-label'>장소</Form.Label>
            <Form.Control
              type='text'
              isInvalid={getBit(formState, 1) === 1}
              value={revPlace}
              disabled={working}
              onChange={e => setRevPlace(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} className='mb-3'>
            <Form.Label htmlFor='reason' className='form-label'>사유</Form.Label>
            <Form.Control
              type='text'
              isInvalid={getBit(formState, 3) === 1}
              value={revRes}
              disabled={working}
              onChange={e => setRevRes(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} className="mb-3">
            <InputGroup className='w-25 mgw'>
              <InputGroup.Text>학번</InputGroup.Text>
              <Form.Control
                type='number'
                placeholder='학번'
                value={scode}
                onChange={e => setScode(Number.parseInt(e.target.value))}
              />
              <Button onClick={exe}>등록</Button>
            </InputGroup>
          </Form.Group>
          <p>이 면학 불참의 담당교사는 면학 불참을 추가한 본인이 됩니다. 신청한 후 별도로 승인해야 합니다.</p>
          {workError === 0 &&
            <Alert variant="success">면학 불참을 추가했습니다.</Alert>
          }
          {workError === 1 &&
            <Alert variant="danger">권한이 부족합니다.</Alert>
          }
          {workError === 2 &&
            <Alert variant="danger">요청이 올바르지 않습니다.</Alert>
          }
          {workError === 3 &&
            <Alert variant="danger">해당 IonID가 없습니다.</Alert>
          }
          {workError === 4 &&
            <Alert variant="danger">이미 해당 시간에 신청된 면학 불참이 있습니다.</Alert>
          }
          {workError === 6 &&
            <Alert variant="danger">문제가 발생했습니다.</Alert>
          }
        </Row>
      </div>
    </Row>
  )
}

export default AddNs;
