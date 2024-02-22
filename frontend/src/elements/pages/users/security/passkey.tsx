import {Alert, Button, Form, Modal, Stack} from "react-bootstrap";
import React, {useEffect, useState} from "react";

import {ReactComponent as FidoIcon} from '../../../../assets/icons/FIDO_Passkey_mark_A_white.svg';
import {ReactComponent as FidoIconDark} from '../../../../assets/icons/FIDO_Passkey_mark_A_black.svg';
import {ReactComponent as X} from '../../../../assets/icons/x.svg';
import {ReactComponent as Pencil} from '../../../../assets/icons/pencil.svg';
import axios from "axios";
import {startRegistration} from "@simplewebauthn/browser";
import {inRange} from "../../../service/checker";
import {changeBit, getBit} from "../../../service/bitmask";

function SinglePasskey(props: passkeyPropsType) {
  function deleteKey() {
    props.setDeleteTargetPasskey(props.passkey);
    props.setDeleteConfirmModalOpen(true);
  }

  function editKey() {
    props.setEditTargetPasskey(props.passkey);
    props.setPasskeyName(props.passkey.passkeyName);
    props.setEditConfirmModalOpen(true);
  }

  return (
    <Stack direction={'horizontal'} className={'px-3 py-2 border rounded'} gap={3}>
      {(props.passkey.authenticator.icon !== null && props.passkey.authenticator.name !== null) &&
        <img src={props.passkey.authenticator.icon} alt={props.passkey.authenticator.name} className={'passkey-icon'}/>
      }
      {props.passkey.authenticator.icon === null  &&
        <FidoIconDark className={'passkey-icon'}/>
      }
      <Stack gap={1}>
        <p>{props.passkey.passkeyName}</p>
        {props.passkey.lastUse === null && <p>마지막 사용: 없음 / 생성: {props.passkey.createdAt.substring(0, 10)}</p>}
        {props.passkey.lastUse !== null &&
          <p>마지막 사용: {props.passkey.lastUse.substring(0, 10)} / 생성: {props.passkey.createdAt.substring(0, 10)}</p>}
        <p className={'text-muted small fw-light'}>{props.passkey.authenticator.name}</p>
      </Stack>
      <Button variant={''} className={'align-self-center'} onClick={() => editKey()}
              disabled={props.working}>
        <Pencil className={'icon'}/>
      </Button>
      <Button variant={''} className={'align-self-center'} onClick={() => deleteKey()} disabled={props.working}>
        <X className={'icon'}/>
      </Button>
    </Stack>
  );
}

type passkeyType = {
  authenticator: {
    aaguid: string;
    icon: string | null;
    name: string | null;
  },
  credentialId: string,
  createdAt: string,
  lastUse: string | null,
  passkeyName: string
}

type passkeyPropsType = {
  key: number,
  passkey: passkeyType
  edit: ((idx: string) => void),
  working: boolean,
  setDeleteTargetPasskey: ((passkey: passkeyType) => void),
  setDeleteConfirmModalOpen: ((open: boolean) => void),
  setEditTargetPasskey: ((passkey: passkeyType) => void),
  setEditConfirmModalOpen: ((open: boolean) => void)
  setPasskeyName: ((name: string) => void)
}

function Passkey() {
  const [queryPasskeyWorkState, setQueryPasskeyWorkState] = useState<number>(0);
  const [deletePasskeyWorkState, setDeletePasskeyWorkState] = useState<number>(0);
  const [editPasskeyWorkState, setEditPasskeyWorkState] = useState<number>(0);
  const [workState, setWorkState] = useState<number>(0);

  const [deleteTargetPasskey, setDeleteTargetPasskey] = useState<passkeyType | undefined>();
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<boolean>(false);

  const [editTargetPasskey, setEditTargetPasskey] = useState<passkeyType | undefined>();
  const [editConfirmModalOpen, setEditConfirmModalOpen] = useState<boolean>(false);
  const [passkeyName, setPasskeyName] = useState<string>('');
  const [passkeyNameValid, setPasskeyNameValid] = useState<number>(0);

  const [passkeyList, setPasskeyList] = useState<passkeyType[]>([]);
  const [working, setWorking] = useState<boolean>(false);

  useEffect(() => {
    updatePasskeyList();
  }, []);

  function updatePasskeyList() {
    axios.get('/auth/api/passkey/get')
      .then(res => {
        setPasskeyList(res.data.result);
      })
      .catch(() => {
        setQueryPasskeyWorkState(1);
      });
  }

  function registerPasskey() {
    setWorking(true);

    axios.get('/auth/api/passkey/registration/options/get')
      .then(res => {
        startRegistration(res.data.result.publicKey).then(attestation => {
          axios.post("/auth/api/passkey/registration/complete", {
            attestation: attestation
          }).then(res => {
            let code = res.data.result;
            if (code === 0) setWorkState(-1);
            else setWorkState(3);
            updatePasskeyList();
          }).catch(() => {
            setWorkState(2);
          }).finally(() => {
            setWorking(false);
          });
        });
      })
      .catch(() => {
        setWorkState(1);
        setWorking(false);
      });
  }

  function deletePasskey() {
    setWorking(true);
    if (deleteTargetPasskey === undefined) return;

    axios.delete('/auth/api/passkey/delete', {
      data: {
        credentialId: deleteTargetPasskey.credentialId
      }
    }).then(() => {
      updatePasskeyList();
    }).catch(err => {
      switch (err.response?.data['result']) {
        case 1:
          setDeletePasskeyWorkState(1);
          break;
        case 2:
          setDeletePasskeyWorkState(2);
          break;
        case 3:
          setDeletePasskeyWorkState(3);
          break;
        case 4:
          setDeletePasskeyWorkState(4);
          break;
        default:
          setDeletePasskeyWorkState(5);
          break;
      }
      setDeletePasskeyWorkState(1);
    }).finally(() => {
      setWorking(false);
    }).finally(() => {
      setDeleteConfirmModalOpen(false);
    });
  }

  function editPasskey() {
    let state = 0;
    if(!inRange(1, 50, passkeyName.length)) state = changeBit(state, 0);
    setPasskeyNameValid(state);
    if(state !== 0) return;

    setWorking(true);
    if (editTargetPasskey === undefined) return;

    axios.patch('/auth/api/passkey/edit/name', {
      credentialId: editTargetPasskey.credentialId,
      name: passkeyName
    }).then(() => {
      updatePasskeyList();
    }).catch(err => {
      switch (err.response?.data['result']) {
        case 1:
          setEditPasskeyWorkState(1);
          break;
        case 2:
          setEditPasskeyWorkState(2);
          break;
        case 3:
          setEditPasskeyWorkState(3);
          break;
        case 4:
          setEditPasskeyWorkState(4);
          break;
        case 5:
          setEditPasskeyWorkState(5);
          break;
        default:
          setEditPasskeyWorkState(6);
          break;
      }
    }).finally(() => {
      setWorking(false);
    }).finally(() => {
      setEditConfirmModalOpen(false);
    });
  }

  return (
    <>
      <Stack gap={1}>
        <h2>Passkey</h2>

        <Stack gap={2}>
          {queryPasskeyWorkState === 1 && <div className='alert alert-danger mt-3 w-fit'>Passkey 목록을 받아오지 못했습니다.</div>}
          {queryPasskeyWorkState === 0 && passkeyList.length === 0 &&
            <div className='alert alert-info mt-3 w-fit'>등록된 Passkey가 없습니다.</div>}
          {queryPasskeyWorkState === 0 &&
            passkeyList.map((passkey, index) => {
              return (
                <SinglePasskey key={index}
                               passkey={
                                 {
                                   passkeyName: passkey.passkeyName,
                                   lastUse: passkey.lastUse,
                                   createdAt: passkey.createdAt,
                                   authenticator: passkey.authenticator,
                                   credentialId: passkey.credentialId
                                 }}
                               edit={editPasskey} working={working}
                               setDeleteTargetPasskey={setDeleteTargetPasskey}
                               setDeleteConfirmModalOpen={setDeleteConfirmModalOpen}
                               setEditConfirmModalOpen={setEditConfirmModalOpen}
                               setEditTargetPasskey={setEditTargetPasskey}
                               setPasskeyName={setPasskeyName}
                />
              );
            })
          }
        </Stack>

        <Button variant={'secondary'} className='my-2 align-self-baseline' onClick={registerPasskey}>
          <FidoIcon className={'icon'}/>
          <span>Passkey 추가</span>
        </Button>
        {workState === -1 && <Alert variant={'success'}>Passkey를 등록했습니다.</Alert>}
        {workState === 1 && <Alert variant={'danger'}>인증 정보를 받아오지 못했습니다.</Alert>}
        {workState === 2 && <Alert variant={'danger'}>Passkey를 검증할 수 없습니다.</Alert>}
        {workState === 3 && <Alert variant={'danger'}>생성된 Passkey를 검증하지 못했습니다.</Alert>}
        {deletePasskeyWorkState === 1 && <Alert variant={'danger'}>삭제 권한이 없습니다.</Alert>}
        {deletePasskeyWorkState === 2 && <Alert variant={'danger'}>올바르지 않은 요청입니다.</Alert>}
        {deletePasskeyWorkState === 3 && <Alert variant={'danger'}>존재하지 않는 Passkey입니다.</Alert>}
        {deletePasskeyWorkState === 4 && <Alert variant={'danger'}>본인 소유의 Passkey만 삭제할 수 있습니다.</Alert>}
        {deletePasskeyWorkState === 5 && <Alert variant={'danger'}>Passkey를 삭제하지 못했습니다.</Alert>}
        {editPasskeyWorkState === 1 && <Alert variant={'danger'}>수정 권한이 없습니다.</Alert>}
        {editPasskeyWorkState === 2 && <Alert variant={'danger'}>올바르지 않은 요청입니다.</Alert>}
        {editPasskeyWorkState === 3 && <Alert variant={'danger'}>올바르지 않은 이름입니다..</Alert>}
        {editPasskeyWorkState === 4 && <Alert variant={'danger'}>존재하지 않는 Passkey입니다.</Alert>}
        {editPasskeyWorkState === 5 && <Alert variant={'danger'}>본인 소유의 Passkey만 수정할 수 있습니다.</Alert>}
        {editPasskeyWorkState === 6 && <Alert variant={'danger'}>Passkey를 수정하지 못했습니다.</Alert>}

        <p>Passkeys를 사용하면 디바이스의 지문 인식, 얼굴 인식, 화면 잠금, 혹은 하드웨어 보안키를 사용하여 안전하게 IonID에 로그인할 수 있습니다. 본인 소유의 디바이스에서만 Passkeys를
          설정해야 합니다.</p>
      </Stack>
      <Modal show={deleteConfirmModalOpen} onHide={() => setDeleteConfirmModalOpen(false)}
             dialogClassName={'modal-dialog-centered'}>
        <Modal.Header closeButton>
          <Modal.Title>Passkey 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteTargetPasskey !== undefined &&
            <Stack gap={2}>
              <p>Passkey '{deleteTargetPasskey.passkeyName}'을 삭제할까요?</p>
              <p>더이상 이 Passkey로 로그인할 수 없게 되며, 기존 인증 방식을 사용해야 합니다. 이 Passkey를 지운 후 언제나 새로운 Passkey를 만들 수 있습니다.</p>
            </Stack>
          }
          {deleteTargetPasskey === undefined && <p>Passkey를 삭제할 수 없습니다.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant={'secondary'} onClick={() => setDeleteConfirmModalOpen(false)}>취소</Button>
          <Button variant={'danger'} onClick={() => deletePasskey()}>삭제</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={editConfirmModalOpen} onHide={() => setEditConfirmModalOpen(false)}
             dialogClassName={'modal-dialog-centered'}>
        <Modal.Header closeButton>
          <Modal.Title>Passkey 이름 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editTargetPasskey !== undefined &&
            <Form>
              <Form.FloatingLabel label={'Passkey 이름'}>
                <Form.Control type={'text'}
                              placeholder={'Passkey 이름'} aria-label={'Passkey 이름'}
                              value={passkeyName} onChange={e => setPasskeyName(e.target.value)}
                              isInvalid={getBit(passkeyNameValid, 0) === 1}
                />
              </Form.FloatingLabel>
            </Form>
          }
          {editTargetPasskey === undefined && <p>Passkey를 수정할 수 없습니다.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant={'secondary'} onClick={() => setEditConfirmModalOpen(false)}>취소</Button>
          <Button variant={'primary'} onClick={() => editPasskey()}>수정</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Passkey;
