import axios from 'axios';
import React, {useState} from 'react'
import {Alert, Button, FormControl, InputGroup, Stack} from 'react-bootstrap';
import {inRange} from "../../../service/checker";
import {changeBit, getBit} from "../../../service/bitmask";

function RemoveGrade() {
  const [ionId, setIonId] = useState<string>('');
  const [workState, setWorkState] = useState<number>(-1);
  const [formState, setFormState] = useState<number>(0);

  function exe() {
    let state = 0;
    if (!inRange(4, 30, ionId.length)) state = changeBit(state, 0);
    setFormState(state);
    if (state !== 0) return;

    axios.patch('/manage/api/ionid/eliminate', {
      id: ionId
    })
      .then(res => {
        setWorkState(0);
      })
      .catch(err => {
        switch (err.response?.data['result']) {
          case 1:
            setWorkState(1);
            break;
          case 2:
            setWorkState(2);
            break;
          default:
            setWorkState(3);
        }
      });
  }

  return (
    <Stack gap={1}>
      <h2>교사로 등록</h2>
      <p>이 작업은 해당 IonID의 학년, 반, 번호 정보를 제거하여 학생으로 인식되지 않도록 합니다.</p>
      <InputGroup className='input-mx-md my-1'>
        <InputGroup.Text>IonID</InputGroup.Text>
        <FormControl type='text'
                     placeholder='IonID' aria-label={'IonID'}
                     value={ionId}
                     onChange={e => setIonId(e.target.value)}
                     isInvalid={getBit(formState, 0) === 1}
        />
        <Button onClick={exe}>확인</Button>
      </InputGroup>
      <p className='fst-italic fw-bold'>이 작업은 비가역적입니다.</p>
      {workState === 0 &&
        <Alert variant='success'>학년/반/번호를 삭제했습니다.</Alert>
      }
      {workState === 1 &&
        <Alert variant='danger'>권한이 부족합니다.</Alert>
      }
      {workState === 2 &&
        <Alert variant='danger'>해당 IonID가 없습니다..</Alert>
      }
      {workState === 3 &&
        <Alert variant='danger'>문제가 발생했습니다.</Alert>
      }
    </Stack>
  );
}

export default RemoveGrade;
