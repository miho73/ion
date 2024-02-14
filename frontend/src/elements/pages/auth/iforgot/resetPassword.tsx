import React, {useState} from 'react'
import {Alert, Button, FloatingLabel, Form, Stack} from 'react-bootstrap';
import {changeBit, getBit} from '../../../service/bitmask';
import {inRange} from '../../../service/checker';
import axios from 'axios';
import {ready} from '../../../service/recaptcha';
import {useNavigate} from "react-router-dom";


function ResetPassword() {
    const [privateCode, setPrivateCode] = useState<string>('');
    const [stage, setStage] = useState<number>(0);
    const [working, setWorking] = useState<boolean>(false);
    const [workState, setWorkState] = useState<number>(-1);
    const [newPassword, setNewPassword] = useState<string>('');
    const [checkPassword, setCheckPassword] = useState<string>('');
    const [formState, setFormState] = useState<number>(0);

    const urlParams = new URLSearchParams(window.location.search);
    const tokenUrl = urlParams.get('token');

    function nxt() {
        setWorking(true);
        ready('check_private_code', token => {
            axios.post('/auth/api/reset-passwd/check-private', {
                token: tokenUrl,
                privateCode: privateCode,
                ctoken: token
            }).then(() => {
                setStage(1);
            }).catch(err => {
                switch (err?.response.data['result']) {
                    case 1:
                    case 2:
                        setWorkState(1);
                        break;
                    case 3:
                        setWorkState(2);
                        break;
                    case 4:
                        setWorkState(3);
                        break;
                    case 5:
                        setWorkState(5);
                        break;
                    case 6:
                        setWorkState(6);
                        break;
                    default:
                        setWorkState(4);
                }
            }).finally(() => {
                setWorking(false);
            });
        });
    }

    const navigate = useNavigate();

    function submit() {
        let state = 0;
        if (!inRange(6, 100, newPassword.length)) state = changeBit(state, 0);
        if (newPassword !== checkPassword) state = changeBit(state, 1);

        setFormState(state);
        if (state !== 0) return;

        setWorking(true);
        ready("reset_password", token => {
            axios.patch('/auth/api/reset-passwd/reset', {
                pwd: newPassword,
                token: tokenUrl,
                ctoken: token
            }).then(() => {
                navigate('/');
            }).catch(err => {
                switch (err?.response.data['result']) {
                    case 4:
                        setWorkState(5);
                        break;
                    case 5:
                        setWorkState(6);
                        break;
                    case 3:
                        setWorkState(7);
                        break;
                    case 2:
                        setWorkState(8);
                        break;
                    case 1:
                    case 6:
                    case 7:
                    default:
                        setWorkState(4);
                }
            }).finally(() => {
                setWorking(false);
            });
        });
    }

    return (
        <form className='vstack gap-3 d-flex justify-content-center align-items-center text-center form-signin'>
            <h1 className='h3 mt-3 mb-0 fw-normal'>IonID 찾기</h1>
            <p className={'h5 fw-normal'}>암호 재설정</p>
            {stage === 0 &&
                <>
                    <FloatingLabel label='개인 확인 코드'>
                        <Form.Control type={'text'}
                                      placeholder={'개인 확인 코드'}
                                      value={privateCode}
                                      onChange={e => setPrivateCode(e.target.value)}
                                      onKeyDown={e => {
                                          if (e.key === 'Enter') nxt();
                                      }}
                                      disabled={working}
                        />
                    </FloatingLabel>
                    <Button onClick={nxt}>다음</Button>
                    {workState === 1 && <Alert variant={'danger'}>잘못된 요청입니다.</Alert>}
                    {workState === 2 && <Alert variant={'danger'}>개인 확인 코드가 잘못되었습니다.</Alert>}
                    {workState === 3 && <Alert variant={'danger'}>승인되지 않은 요청입니다.</Alert>}
                    {workState === 4 && <Alert variant={'danger'}>잠시 후에 다시 시도해주세요.</Alert>}
                    {workState === 5 && <Alert variant={'danger'}>reCAPTCHA 확인에 실패했습니다.</Alert>}
                    {workState === 6 && <Alert variant={'danger'}>사용자 보호를 위해 지금은 암호를 재설정할 수 없습니다.</Alert>}
                </>
            }
            {stage === 1 &&
                <Stack className="gap-3 justify-content-center align-items-center">
                    <FloatingLabel label='New Password'>
                        <Form.Control type={'password'}
                                      placeholder={'New Password'}
                                      className={'pe-5 fs-6' + (getBit(formState, 0) ? ' is-invalid' : '')}
                                      value={newPassword}
                                      onChange={e => setNewPassword(e.target.value)}
                                      onKeyDown={e => {
                                          if (e.key === 'Enter') submit();
                                      }}
                                      autoComplete={'new-password'}
                                      disabled={working}
                        />
                        <p className='invalid-feedback mb-0'>암호는 6자 이상이어야 합니다.</p>
                    </FloatingLabel>
                    <FloatingLabel label='Password Confirm'>
                        <Form.Control type={'password'}
                                      placeholder={'Confirm Password'}
                                      className={'pe-5 fs-6' + (getBit(formState, 1) ? ' is-invalid' : '')}
                                      value={checkPassword}
                                      onChange={e => setCheckPassword(e.target.value)}
                                      onKeyDown={e => {
                                          if (e.key === 'Enter') submit();
                                      }}
                                      autoComplete={'new-password'}
                                      disabled={working}
                        />
                        <p className='invalid-feedback mb-0'>암호를 확인해주세요.</p>
                    </FloatingLabel>
                    <Button onClick={submit}>확인</Button>
                    {workState === 4 && <Alert variant={'danger'}>잠시 후에 다시 시도해주세요.</Alert>}
                    {workState === 7 && <Alert variant={'danger'}>암호는 6자리 이상으로 설정해주세요.</Alert>}
                    {workState === 8 && <Alert variant={'danger'}>암호를 변경할 수 없습니다(세션 시간초과).</Alert>}
                    {workState === 5 && <Alert variant={'danger'}>reCAPTCHA 확인에 실패했습니다.</Alert>}
                    {workState === 6 && <Alert variant={'danger'}>사용자 보호를 위해 지금은 암호를 재설정할 수 없습니다.</Alert>}
                </Stack>
            }
        </form>
    )
}

export default ResetPassword;