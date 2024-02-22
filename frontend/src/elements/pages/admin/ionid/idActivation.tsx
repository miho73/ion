import axios from "axios";
import React, {useState} from "react";
import {Alert, Button, Form, InputGroup, Stack} from "react-bootstrap";
import {inRange} from "../../../service/checker";
import {changeBit, getBit} from "../../../service/bitmask";

function IonIdActivation() {
  const [id, setId] = useState('');
  const [result, setResult] = useState<any[]>([]);
  const [formState, setFormState] = useState(0);

  function setActiveState(mode: number) {
    let state = 0;
    if (!inRange(4, 30, id.length)) state = changeBit(state, 0);
    setFormState(state);
    if (state !== 0) return;

    axios.patch('/manage/api/ionid/active/patch', {
      id: id,
      ac: mode
    })
      .then(res => {
        const r = res.data['result'];
        setResult([
          0,
          `"${r['sub']}"의 활성화 상태를 "${r['act']}"로 변경했습니다.`
        ]);
      })
      .catch(err => {
        let msg;
        switch (err.response?.data['result']) {
          case 1:
            msg = '권한이 부족합니다.'
            break;
          case 4:
            msg = '해당 IonID가 없습니다.'
            break;
          case 5:
            msg = '자신은 상태는 수정할 수 없습니다.'
            break;
          default:
            msg = '문제가 발생했습니다.'
            break;
        }
        setResult([1, msg])
      });
  }

  return (
    <Stack gap={1}>
      <h2>IonID 활성화</h2>
      <InputGroup className="input-mx-lg">
        <Form.Control
          type="text"
          placeholder="IonID" aria-label={"IonID"}
          value={id}
          onChange={e => setId(e.target.value)}
          isInvalid={getBit(formState, 0) !== 0}
        />
        <Button variant="warning" onClick={() => setActiveState(0)}>Inactivate</Button>
        <Button variant="success" onClick={() => setActiveState(1)}>Activate</Button>
        <Button variant="danger" onClick={() => setActiveState(2)}>Ban</Button>
      </InputGroup>
      {result[0] === 0 &&
        <Alert variant="success" className={'my-1'}>{result[1]}</Alert>
      }
      {result[0] === 1 &&
        <Alert variant="danger" className={'my-1'}>{result[1]}</Alert>
      }
    </Stack>
  );
}

export default IonIdActivation;
