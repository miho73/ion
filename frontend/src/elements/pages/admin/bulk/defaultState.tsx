import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {Alert, Button, ButtonGroup, Stack} from 'react-bootstrap';

function SetDefaultState() {
  const [workState, setWorkState] = useState(-1);
  const [working, setWorking] = useState(false);
  const [current, setCurrent] = useState('');

  function exec(to: number) {
    setWorking(true);
    axios.patch('/manage/api/bulk/default-ionid-state/set', {
      defaultState: to
    })
      .then(res => {
        setWorkState(0);
      })
      .catch(err => {
        switch (err?.response.data['result']) {
          case 1:
            setWorkState(1);
            break;
          default:
            setWorkState(2);
            break;
        }
      })
      .finally(() => {
        reload();
        setWorking(false);
      });
  }

  function reload() {
    axios.get('/manage/api/bulk/default-ionid-state/get')
      .then(res => {
        setCurrent(res.data['result']);
      })
      .catch(err => {
        setCurrent('알 수 없음');
      });
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <>
      <Stack>
        <p className='m-1'>이 설정은 새로 생성되는 IonID의 상태를 INACTIVATED가 아닌 다른 상태로 초기화되도록 합니다.</p>
        <ButtonGroup className='w-fit mb-2'>
          <Button disabled={working} onClick={() => exec(0)} variant='warning'
                  className='w-fit'>INACTIVATED</Button>
          <Button disabled={working} onClick={() => exec(1)} variant='success'
                  className='w-fit'>ACTIVATED</Button>
          <Button disabled={working} onClick={() => exec(2)} variant='danger'
                  className='w-fit'>BANNED</Button>
        </ButtonGroup>
        {current !== '' &&
          <p>현재 설정: {current}</p>
        }
        {workState === 1 &&
          <Alert variant="danger">권한이 부족합니다.</Alert>
        }
        {workState === 2 &&
          <Alert variant="danger">문제가 발생했습니다.</Alert>
        }
      </Stack>
    </>
  );
}

export default SetDefaultState;
