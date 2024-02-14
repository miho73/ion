import axios from "axios";
import React, {useState} from "react";
import {Alert, Button, Form, InputGroup, Table} from "react-bootstrap";

function AcceptPwdChange() {
    const [usrLoaded, setUsrLoaded] = useState(false);
    const [id, setId] = useState('');
    const [workState, setWorkState] = useState(-1);
    const [workStaea, setWorkStaea] = useState(-1);
    const [reqData, setReqData] = useState({ionid: '', name: '', scode: 0, status: ''});
    const [reqUid, setReqUid] = useState(0);
    const [urlToken, setUrlToken] = useState('');

    function load() {
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
        <>
            <InputGroup className="w-50 mgw mb-3">
                <Form.Control type={'text'}
                              placeholder={'IonID'}
                              value={id}
                              onChange={e => setId(e.target.value)}
                />
                <Button onClick={load}>확인</Button>
                <Button onClick={() => ctrl(true)} disabled={!usrLoaded}>승인</Button>
                <Button onClick={() => ctrl(false)} disabled={!usrLoaded}>거절</Button>
            </InputGroup>
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
        </>
    );
}

export default AcceptPwdChange;