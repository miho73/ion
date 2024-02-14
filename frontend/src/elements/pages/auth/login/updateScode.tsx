import React, {useEffect, useState} from 'react'
import {Alert, Button, FloatingLabel, Form, FormLabel, InputGroup} from 'react-bootstrap';
import {changeBit, getBit} from '../../../service/bitmask';
import {inRange} from '../../../service/checker';
import axios from 'axios';
import {ready} from '../../../service/recaptcha';


function UpdateScode() {
    const [grade, setGrade] = useState<number>(1);
    const [clas, setClas] = useState<number>();
    const [scode, setScode] = useState<number | undefined>();
    const [working, setWorking] = useState<boolean>(true);
    const [workState, setWorkState] = useState<number>(-1);
    const [formState, setFormState] = useState<number>(0);

    const yrs = new Date().getFullYear();

    useEffect(() => {
        axios.get('/user/api/scode-change/query')
            .then((res: any) => {
                setGrade(res.data['result']);
                setWorking(false);
            })
            .catch(() => {
                window.location.reload();
            });
    }, []);

    function submit() {
        let state = 0;
        if (!inRange(1, 4, clas)) state = changeBit(state, 0);
        if (!inRange(1, 24, scode)) state = changeBit(state, 1);
        setFormState(state);
        if (state !== 0) return;

        setWorking(true);
        ready('update_scode', token => {
            axios.patch('/user/api/scode-change/change', {
                clas: clas,
                scode: scode,
                ctoken: token
            })
                .then(() => {
                    window.location.reload();
                })
                .catch(err => {
                    switch (err.response?.data['result']) {
                        case 1:
                        case 6:
                        case 4:
                            setWorkState(1);
                            break;
                        case 2:
                            setWorkState(2);
                            break;
                        case 3:
                            setWorkState(3);
                            break;
                        case 5:
                            setWorkState(4);
                            break;
                    }
                })
                .finally(() => {
                    setWorking(false);
                });
        });
    }


    return (
        <form className='vstack gap-3 d-flex justify-content-center align-items-center text-center form-signin'>
            <h1 className='h3 my-3 fw-normal'>IonID</h1>
            <p className='fw-bold fs-5 m-1'>학번을 업데이트해주세요.</p>
            <InputGroup>
                <FloatingLabel label='반'>
                    <Form.Control type='number'
                                  className={'pe-5 fs-6 form-control-lg' + (getBit(formState, 0) ? ' is-invalid' : '')}
                                  disabled={working}
                                  placeholder='반'
                                  aria-label='반'
                                  value={clas}
                                  onChange={e => setClas(Number.parseInt(e.target.value))}
                    />
                    <FormLabel htmlFor='clas'>반</FormLabel>
                </FloatingLabel>
                <FloatingLabel label='번호'>
                    <Form.Control type='number'
                                  className={'pe-5 fs-6 form-control-lg' + (getBit(formState, 1) ? ' is-invalid' : '')}
                                  disabled={working}
                                  placeholder='번호'
                                  aria-label='번호'
                                  value={scode}
                                  onChange={e => setScode(Number.parseInt(e.target.value))}
                    />
                    <Form.Label htmlFor='scode'>번호</Form.Label>
                </FloatingLabel>
            </InputGroup>
            {inRange(1, 3, grade) && inRange(1, 4, clas) && inRange(1, 24, scode) &&
                <div className='vstack'>
                        <p className='my-0'>{yrs - 1992 - grade}기의 {'' + grade + clas + ((scode ? scode : 0) < 10 ? '0' + scode : scode)}입니다.</p>
                </div>
            }
            <Button className='mt-2' disabled={working} onClick={submit}>Continue</Button>
            {workState === 1 &&
                <Alert variant='danger'>
                    <p className='m-1'>학번을 수정하지 못했습니다.</p>
                    <p className='m-1'>나중에 다시 시도해주세요.</p>
                </Alert>
            }
            {workState === 2 &&
                <Alert variant='danger'>
                    <p className='m-1'>reCAPTCHA를 확인하지 못했습니다.</p>
                </Alert>
            }
            {workState === 3 &&
                <Alert variant='danger'>
                    <p className='m-1'>사용자 보호를 위해 지금은 학번을 업데이트할 수 없습니다.</p>
                </Alert>
            }
            {workState === 4 &&
                <Alert variant='danger'>
                    <p className='m-1'>해당 IonID는 학번을 바꿀 수 없습니다.</p>
                </Alert>
            }
            <p className='m-0 muted'>학번을 재설정한 후 로그인이 완료됩니다.</p>
        </form>
    )
}

export default UpdateScode;