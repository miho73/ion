import React, {useEffect, useState} from "react";
import {Alert, Button, FloatingLabel, Form, Stack} from "react-bootstrap";
import axios from "axios";
import {ready} from "../../../service/recaptcha";
import ErrorPage from "../../etc/error";


type IForgotDashboardProps = {
    id: string
}

function IForgotDashboard(props: IForgotDashboardProps) {
    const [privateCode, setPrivateCode] = useState<string>('');
    const [workState, setWorkState] = useState<number>(-1);

    useEffect(() => {
        axios.get("/auth/api/reset-passwd/query", {
            params: {id: props.id}
        }).then(res => {
            if (res.data['result']['status'] === 'REQUESTED') {
                setPrivateCode(res.data['result']['privateCode']);
                setWorkState(0);
            } else {
                setWorkState(1);
            }
        }).catch(err => {
            setWorkState(2);
        });
    }, []);

    if (workState === 2) {
        <ErrorPage exp='잘못된 접근입니다.'/>
    }

    return (
        <main className='container mt-4'>
            <Stack className='justify-content-center align-items-center text-center'>
                <h1 className='h3 mt-3 mb-0 fw-normal'>IonID 찾기</h1>
                <p className={'h5 my-4 fw-normal'}>암호 재설정</p>
                <p className={'my-1'}>암호 재설정이 신청되었습니다. 학년 부장 선생님께 찾아가서 재설정 신청을 승인하도록 부탁드리세요. 이 신청은 오늘만 유효합니다.</p>
                <p className={'my-1'}>재설정 신청이 승인되면 암호를 변경할 수 있는 링크가 생성됩니다. 이 링크를 통해 암호를 변경할 수 있습니다.</p>
                <p className={'my-1'}>사용자 보호를 위해 암호를 재설정하기 전에 개인 확인 코드를 입력해야 합니다. 코드를 잘 기억해두세요.</p>
                {workState === -1 &&
                    <p className={'fs-5 fw-bold'}>확인중</p>
                }
                {workState === 0 &&
                    <>
                        <p className={'fs-4 fw-bold mt-4 mb-1'}>개인 확인 코드: {privateCode}</p>
                        <p className={'fs-5 fw-bold'}>이 코드는 한 번만 볼 수 있습니다.</p>
                    </>
                }
                {workState === 1 &&
                    <p className={'fs-5 fw-bold'}>이미 개인 확인 코드를 확인했습니다.</p>
                }
            </Stack>
        </main>
    )
}

function IForgot() {
    const [stage, setStage] = React.useState<number>(0);
    const [workState, setWorkState] = useState<number>(-1);
    const [working, setWorking] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [scode, setScode] = useState<number>();
    const [id, setId] = useState<string>('');

    function nxt() {
        setWorking(true);
        axios.get('/auth/api/reset-passwd/verify', {
            params: {id: id}
        }).then(res => {
            switch (res.data['result']) {
                case 0:
                    setStage(1);
                    setWorkState(-1);
                    break;
                case 1:
                    setWorkState(3);
                    break;
                case 2:
                    setWorkState(0);
                    break;
                case 3:
                    setStage(2);
                    setWorkState(-1);
                    break;
            }
        }).catch(err => {
            setWorkState(1);
        }).finally(() => {
            setWorking(false);
        });
    }

    function submit() {
        setWorking(true);
        ready('reset_password_request', function (token: string) {
            axios.post('/auth/api/reset-passwd/request', {
                id: id,
                name: name,
                scode: scode,
                ctoken: token
            }).then(res => {
                setStage(2);
                setWorkState(-1);
            }).catch(err => {
                switch (err?.response.data['result']) {
                    case 1:
                        setWorkState(3);
                        break;
                    case 3:
                        setWorkState(4);
                        break;
                    case 4:
                        setWorkState(5);
                        break;
                    case 5:
                    case 6:
                        setWorkState(6);
                        break;
                    case 7:
                    default:
                        setStage(2);
                }
            }).finally(() => {
                setWorking(false);
            });
        });
    }

    if (stage === 2) {
        return (
            <IForgotDashboard id={id}/>
        );
    }

    return (
        <main className='container mt-4'>
            <form className='vstack gap-3 d-flex justify-content-center align-items-center text-center form-signin'>
                <h1 className='h3 mt-3 mb-0 fw-normal'>IonID 찾기</h1>
                <p className={'h5 fw-normal'}>암호 재설정</p>
                {stage === 0 &&
                    <>
                        <p className='fs-6 m-0'>복구할 IonID를 입력해주세요.</p>
                        <div>
                            <FloatingLabel label={'IonID'}>
                                <Form.Control type={'text'}
                                              placeholder={'IonID'}
                                              autoComplete={'username'}
                                              disabled={(stage !== 0) || working}
                                              value={id}
                                              onChange={e => setId(e.target.value)}
                                              onKeyDown={e => {
                                                  if (e.key === 'Enter') nxt();
                                              }}
                                />
                            </FloatingLabel>
                        </div>
                    </>
                }
                {stage === 1 &&
                    <>
                        <p className='fs-6 m-0'>이 IonID의 학번과 이름을 확인해주세요.</p>
                        <div>
                            <FloatingLabel label={'이름'} className={'my-3'}>
                                <Form.Control type={'text'}
                                              placeholder={'이름'}
                                              autoComplete={'name'}
                                              disabled={working}
                                              value={name}
                                              onChange={e => setName(e.target.value)}
                                              onKeyDown={e => {
                                                  if (e.key === 'Enter') submit();
                                              }}
                                />
                            </FloatingLabel>
                            <FloatingLabel label={'학번'} className={'my-1'}>
                                <Form.Control type={'number'}
                                              placeholder={'학번'}
                                              disabled={working}
                                              value={scode}
                                              onChange={e => setScode(parseInt(e.target.value))}
                                              onKeyDown={e => {
                                                  if (e.key === 'Enter') submit();
                                              }}
                                />
                            </FloatingLabel>
                        </div>
                        <Button className={'w-fit'} onClick={submit}>제출</Button>
                    </>
                }
                {stage === 0 &&
                    <Button className={'w-fit'} onClick={nxt}>다음</Button>
                }
                {workState === 0 &&
                    <Alert variant={'danger'}>존재하지 않는 IonID 입니다.</Alert>
                }
                {workState === 1 &&
                    <Alert variant={'danger'}>IonID를 확인하지 못했습니다.</Alert>
                }
                {workState === 2 &&
                    <Alert variant={'danger'}>암호 재설정을 신청하지 못했습니다.</Alert>
                }
                {workState === 3 &&
                    <Alert variant={'danger'}>이미 로그인 되어있으므로 암호를 재설정할 수 없습니다.</Alert>
                }
                {workState === 4 &&
                    <Alert variant={'danger'}>reCAPTCHA 확인에 실패했습니다.</Alert>
                }
                {workState === 5 &&
                    <Alert variant={'danger'}>사용자 보호를 위해 지금은 암호 재설정을 신청할 수 없습니다.</Alert>
                }
                {workState === 6 &&
                    <Alert variant={'danger'}>IonID를 찾을 수 없습니다.</Alert>
                }
            </form>
        </main>
    );
}

export default IForgot;