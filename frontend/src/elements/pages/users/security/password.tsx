import {Alert, Button, Form, InputGroup, Stack} from "react-bootstrap";
import React, {useState} from "react";
import {changeBit, getBit} from "../../../service/bitmask";
import {inRange} from "../../../service/checker";
import axios from "axios";
import {ready} from "../../../service/recaptcha";

type changePwdType = {
  setPwdChangeOpen: (flag: boolean) => void;
  setPwdChangeState: (state: number) => void;
}

function ChangePassword(props: changePwdType) {
  const [currentPwd, setCurrentPwd] = useState<string>('');
  const [newPwd, setNewPwd] = useState<string>('');
  const [newPwdConfirm, setNewPwdConfirm] = useState<string>('');

  const [formState, setFormState] = useState<number>(0);

  function close() {
    setCurrentPwd('');
    setNewPwd('');
    setNewPwdConfirm('');
    props.setPwdChangeOpen(false);
  }

  function detectEnter(e: React.KeyboardEvent) {
    if(e.key === 'Enter') change();
  }

  function change() {
    let state = 0;
    if (!inRange(6, 100, currentPwd.length)) state = changeBit(state, 0);
    if (!inRange(6, 100, newPwd.length)) state = changeBit(state, 1);
    if (!inRange(6, 100, newPwdConfirm.length)) state = changeBit(state, 2);
    if (newPwd !== newPwdConfirm) state = changeBit(state, 3);
    setFormState(state);
    if(state !== 0) return;

    ready('change_password', token => {
      axios.patch('/auth/api/password/patch', {
        currentPwd: currentPwd,
        newPwd: newPwd,
        ctoken: token
      }).then(() => {
        props.setPwdChangeState(-1);
      }).catch(err => {
        switch (err?.response.data['result']) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 7:
          case 8:
            props.setPwdChangeState(err.response.data['result']);
            break;
          default:
            props.setPwdChangeState(6);
        }
      }).finally(close);
    });
  }

  return (
    <Form className={'d-flex flex-column gap-1 auth'}>
      <Form.Group>
        <Form.FloatingLabel label={'현재 비밀번호'}>
          <Form.Control type={'password'}
                        placeholder={'현재 비밀번호'} aria-label={'현재 비밀번호'}
                        value={currentPwd}
                        onChange={e => setCurrentPwd(e.target.value)}
                        autoComplete={'current-password'}
                        onKeyDown={detectEnter}
                        isInvalid={getBit(formState, 0) === 1}
          />
        </Form.FloatingLabel>
      </Form.Group>
      <Form.Group>
        <Form.FloatingLabel label={'새 비밀번호'}>
          <Form.Control type={'password'}
                        placeholder={'새 비밀번호'} aria-label={'새 비밀번호'}
                        value={newPwd}
                        onChange={e => setNewPwd(e.target.value)}
                        autoComplete={'new-password'}
                        onKeyDown={detectEnter}
                        isInvalid={getBit(formState, 1) === 1}
          />
          <Form.Control.Feedback type={'invalid'}>비밀번호는 6자 이상이어야 합니다.</Form.Control.Feedback>
        </Form.FloatingLabel>
      </Form.Group>
      <Form.Group>
        <Form.FloatingLabel label={'비밀번호 확인'}>
          <Form.Control type={'password'}
                        placeholder={'비밀번호 확인'} aria-label={'비밀번호 확인'}
                        value={newPwdConfirm}
                        onChange={e => setNewPwdConfirm(e.target.value)}
                        autoComplete={'new-password'}
                        onKeyDown={detectEnter}
                        isInvalid={getBit(formState, 2) === 1}
          />
          <Form.Control.Feedback type={'invalid'}>비밀번호를 확인해주세요.</Form.Control.Feedback>
        </Form.FloatingLabel>
      </Form.Group>
      <Stack direction={'horizontal'} gap={2} className={'my-1'}>
        <Button variant={'primary'} onClick={change}>변경</Button>
        <Button variant={'outline-primary'} onClick={close}>취소</Button>
      </Stack>
    </Form>
  )
}

function Password() {
  const [changePwdOpen, setChangePwdOpen] = useState<Boolean>(false);
  const [changePwdState, setChangePwdState] = useState<number>(0);

  return (
    <Stack gap={1} className={'align-items-start'}>
      <h2>비밀번호</h2>
      {changePwdOpen && <ChangePassword setPwdChangeOpen={setChangePwdOpen} setPwdChangeState={setChangePwdState}/>}
      {!changePwdOpen &&
        <>
          { changePwdState === 1 && <Alert variant={'danger'}>권한이 부족합니다.</Alert>}
          { changePwdState === 2 && <Alert variant={'danger'}>잘못된 요청입니다.</Alert>}
          { changePwdState === 3 && <Alert variant={'danger'}>요청인자가 잘못됬습니다.</Alert>}
          { changePwdState === 4 && <Alert variant={'danger'}>IonID를 찾을 수 없습니다.</Alert>}
          { changePwdState === 5 && <Alert variant={'danger'}>잘못된 암호입니다.</Alert>}
          { changePwdState === 6 && <Alert variant={'danger'}>암호 변경에 실패했습니다.</Alert>}
          { changePwdState === 7 && <Alert variant={'danger'}>reCAPTCHA를 확인하지 못했습니다.</Alert>}
          { changePwdState === 8 && <Alert variant={'danger'}>사용자 보호를 위해 지금은 암호를 변경할 수 없습니다.</Alert>}
          { changePwdState === -1 && <Alert variant={'success'}>암호가 변경되었습니다.</Alert>}
          <Button variant={'outline-primary'}
                  onClick={() => setChangePwdOpen(!changePwdOpen)}
          >비밀번호 변경</Button>
        </>
      }
    </Stack>
  )
}

export default Password;
