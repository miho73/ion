import axios from "axios";
import React, {useState} from "react";
import {Alert, Button, Form, InputGroup, Stack, Table} from "react-bootstrap";
import {inRange} from "../../../service/checker";
import {changeBit, getBit} from "../../../service/bitmask";

function AcceptPwdChange() {
  const [usrLoaded, setUsrLoaded] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [workState, setWorkState] = useState<number>(-1);
  const [workStaea, setWorkStaea] = useState<number>(-1);
  const [reqData, setReqData] = useState<{
    ionid: string,
    name: string,
    scode: number,
    status: string
  }>({ionid: '', name: '', scode: 0, status: ''});
  const [reqUid, setReqUid] = useState<number>(0);
  const [urlToken, setUrlToken] = useState<string>('');
  const [formState, setFormState] = useState<number>(0);

  function load() {
    let state = 0;
    if (!inRange(4, 30, id.length)) state = changeBit(state, 0);
    setFormState(state);
    if (state !== 0) return;

    axios.get('/manage/api/reset-passwd/query', {
      params: {id: id}
    })
      .then(res => {
        setReqData({
          ionid: res.data['result']['id'],
          name: res.data['result']['name'],
          scode: res.data['result']['scode'],
          status: res.data['result']['status']
        });
        setUsrLoaded(true);
        setReqUid(res.data['result']['uid']);
        setWorkState(0);
      })
      .catch(err => {
        switch (err?.response.data['result']) {
          case 0:
            setWorkStaea(4);
            break;
          case 2:
            setWorkState(1);
            break;
          case 3:
            setWorkState(2);
            break;
          default:
            setWorkState(5);
        }
      });
  }

  function ctrl(state: boolean) {
    let fstate = 0;
    if (!inRange(4, 30, id.length)) fstate = changeBit(fstate, 0);
    setFormState(fstate);
    if (fstate !== 0) return;

    axios.patch('/manage/api/reset-passwd/accept', {
      accept: state,
      reqUid: reqUid
    })
      .then(res => {
        if (state) {
          setUrlToken(res.data['result']);
          setWorkStaea(0);
        } else setWorkStaea(5);
      })
      .catch(err => {
        switch (err?.response.data['result']) {
          case 1:
            setWorkStaea(1);
            break;
          case 3:
            setWorkStaea(2);
            break;
          case 4:
            setWorkStaea(3);
            break;
          case 2:
          default:
            setWorkStaea(4);
        }
      })
      .finally(() => {
        load();
      });
  }

  let status = '';
  switch (reqData.status) {
    case 'REQUESTED':
      status = 'REQUESTED (code not saw)';
      break;
    case 'WAITING':
      status = 'REQUESTED (code saw)';
      break;
    default:
      status = reqData.status;
  }

  function copyLink() {
    navigator.clipboard.writeText('https://ionya.cc/auth/iforgot/reset?token=' + urlToken);
  }

  return (
    <Stack>
      <h2>암호 재설정 확인</h2>
      <InputGroup className={'input-mx-lg'}>
        <Form.Control type={'text'}
                      placeholder={'IonID'} aria-label={'IonID'}
                      value={id}
                      isInvalid={getBit(formState, 0) === 1}
                      onChange={e => setId(e.target.value)}
        />
        <Button onClick={load}>확인</Button>
        <Button onClick={() => ctrl(true)} disabled={!usrLoaded}>승인</Button>
        <Button onClick={() => ctrl(false)} disabled={!usrLoaded}>거절</Button>
      </InputGroup>
      <div className={'table-cover'}>
        <Table>
          <thead>
          <tr>
            <th>IonID</th>
            <th>이름</th>
            <th>학번</th>
            <th>상태</th>
          </tr>
          </thead>
          <tbody>
          {workState !== 0 &&
            <tr>
              <td colSpan={4}>No data</td>
            </tr>
          }
          {workState === 0 &&
            <tr>
              <td>{reqData.ionid}</td>
              <td>{reqData.name}</td>
              <td>{reqData.scode}</td>
              <td>{status}</td>
            </tr>
          }
          </tbody>
        </Table>
      </div>
      {workState === 1 && <Alert variant={'danger'}>이 IonID는 암호 재설정을 신청하지 않았습니다.</Alert>}
      {workState === 2 && <Alert variant={'danger'}>존재하지 않는 IonID입니다.</Alert>}
      {workState === 4 && <Alert variant={'danger'}>권한이 부족합니다.</Alert>}
      {workState === 5 && <Alert variant={'danger'}>작업을 처리하지 못했습니다.</Alert>}

      {workStaea === 0 &&
        <Alert variant={'success'}>
          <p className={'my-1'}>암호 재설정 신청을 승인했습니다.</p>
          <p className={'my-1'}>이 링크를 복사해서 재설정을 요청한 학생에게 전달해주세요. 이 링크는 지금 한 번만 확인할 수 있습니다.</p>
          <Button variant={'outline-success'} onClick={copyLink}>암호 재설정 링크 복사</Button>
        </Alert>
      }
      {workStaea === 5 && <Alert variant={'success'}>암호 재설정 신청을 거부했습니다.</Alert>}
      {workStaea === 1 && <Alert variant={'danger'}>권한이 부족합니다.</Alert>}
      {workStaea === 2 && <Alert variant={'danger'}>신청을 찾을 수 없습니다.</Alert>}
      {workStaea === 3 && <Alert variant={'danger'}>신청을 승인하려면 REQUESTED 상태여야 합니다.</Alert>}
      {workStaea === 4 && <Alert variant={'danger'}>작업을 처리하지 못했습니다.</Alert>}
    </Stack>
  );
}

export default AcceptPwdChange;
