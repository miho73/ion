import React, {useState} from "react";
import {Alert, Button, ButtonGroup, Stack} from "react-bootstrap";
import axios from "axios";


type ChangeNsPresetProps = {
  timePreset: number,
  updatePreset: (mode: number) => void
}

function ChangeNsPreset(props: ChangeNsPresetProps) {
  const [working, setWorking] = useState<boolean>(false);
  const [workState, setWorkState] = useState<number>(0);

  function exec(mode: number) {
    setWorking(true);
    axios.patch('/manage/api/ns/mode/set', {
      mode: mode
    })
      .then(() => {
        props.updatePreset(mode);
      })
      .catch(err => {
        switch (err.response?.data['result']) {
          case 1:
            setWorkState(1);
            break;
          case 2:
            setWorkState(2);
            break;
          case 3:
            setWorkState(3);
            break;
          default:
            setWorkState(-1);
            break;
        }
      })
      .finally(() => {
        setWorking(false);
      });
  }

  return (
    <Stack className={'align-items-start'} gap={1}>
      <h2>면학 불참 시간 구성</h2>
      <ButtonGroup>
        <Button disabled={working} onClick={() => exec(0)}
                className='w-fit'>3 면학</Button>
        <Button disabled={working} onClick={() => exec(1)}
                className='w-fit'>4 면학</Button>
      </ButtonGroup>

      <div>
        <p className={'my-2'}>현재 면학 불참 시간 구성: {props.timePreset === 0 ? "3면학" : "4면학"}</p>
        {props.timePreset === 0 &&
          <ul>
            <li>8면학</li>
            <li>1면학</li>
            <li>2면학</li>
          </ul>
        }
        {props.timePreset === 1 &&
          <ul>
            <li>오후 1차</li>
            <li>오후 2차</li>
            <li>야간 1차</li>
            <li>야간 2차</li>
          </ul>
        }
      </div>
      {workState === 1 &&
        <Alert variant='danger w-100'>권한이 부족합니다.</Alert>
      }
      {workState === 2 &&
        <Alert variant='danger w-100'>잘못된 요청입니다.</Alert>
      }
      {workState === 3 &&
        <Alert variant='danger w-100'>해당 면학 불참 시간으로 구성할 수 없습니다.</Alert>
      }
      {workState === -1 &&
        <Alert variant='danger w-100'>면학 불참 시간을 구성하지 못했습니다.</Alert>
      }
    </Stack>
  );
}

export default ChangeNsPreset;
