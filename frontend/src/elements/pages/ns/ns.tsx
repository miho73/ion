import React, {useEffect, useState} from 'react';

import LnsRoomSelect from './lns/lns';
import {changeBit, getBit} from '../../service/bitmask';
import {inRange} from '../../service/checker';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import AuthError from '../auth/AuthError';

import {Alert, Button, Col, Container, Form, Modal, Row, Stack, Table} from 'react-bootstrap';
import NsState from './nsState';
import {ready} from '../../service/recaptcha';
import {isLogin} from "../../service/auth";

function Ns() {
    const [lnsRoomRequired, setLnsRoomRequired] = useState<boolean>(false);
    const [revTime, setRevTime] = useState<number>(-1);
    const [revPlace, setRevPlace] = useState<string>('');
    const [revSup, setRevSup] = useState<string>('');
    const [revRes, setRevRes] = useState<string>('');
    const [lnsSelected, setLnsSelected] = useState<number>(-1);
    const [formState, setFormState] = useState<number>(0);

    const [working, setWorking] = useState<boolean>(false);
    const [sErrorState, setSError] = useState<number>(-1);

    const [cNsLst, setNsLst] = useState<any[]>([]);
    const [cNsErr, setNsErr] = useState<boolean>(false);
    const [date, setDate] = useState<string>('');
    const [uName, setUName] = useState<string>('');
    const [timePreset, setTimePreset] = useState<number>(-1);

    const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false);
    const [targetNs, setTargetNs] = useState<any[]>([]);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [deleteResult, setDeleteResult] = useState<number>(-1);

    const [seatLst, setSeatLst] = useState<any[]>([]);
    const [lnsError, setLnsError] = useState<number>(0);

    const [autoFill, setAutoFill] = useState(false);
    const [id, setId] = useState('');

    const navigate = useNavigate();

    const [loginState, setLoginState] = useState(-1);
    useEffect(() => {
        isLogin(setLoginState);
    }, []);

    useEffect(() => {
        if (loginState === 0) {
            loadNsReqs();
        }
    }, [loginState]);

    useEffect(() => {
        loadLns();
    }, [lnsRoomRequired]);

    useEffect(() => {
        if (id === '') return;

        let nsaf = localStorage.getItem('nsaf');

        if (nsaf === null) {
            localStorage.setItem('nsaf', '{}');
        } else {
            let parsed = JSON.parse(nsaf);

            if (parsed.hasOwnProperty(id)) {
                setAutoFill(true);

                let me = parsed[id];
                setRevPlace(me['at']);
                setRevSup(me['sup']);
                setRevRes(me['rea']);
            }
        }
    }, [id]);

    if (loginState === -1) {
        return <></>;
    }
    if (loginState === 1) {
        navigate('/?ret=/ns');
        return <></>;
    }
    if (loginState === 2) {
        return <AuthError/>
    }

    function loadNsReqs() {
        setDeleting(true);

        axios.get('/ns/api/nsr/get')
            .then(res => {
                const reqs = res.data['result'];
                setUName(reqs['name']);
                setDate(reqs['date']);
                setNsLst(reqs['reqs']);
                setId(reqs['id']);
                setTimePreset(reqs['preset']);
            })
            .catch(() => {
                setNsErr(true);
            }).finally(() => {
            setDeleting(false);
        });
    }

    let rr: any[] = [];
    if (!cNsErr) {
        if (cNsLst.length === 0) {
            rr.push(
                <tr>
                    <td colSpan={7}>
                        <p className='my-2 fw-bold'>신청한 면불이 없습니다.</p>
                    </td>
                </tr>
            );
        } else {
            cNsLst.forEach(req => {
                let row = <NsState
                    time={req.time}
                    place={req.place}
                    superviser={req.supervisor}
                    reason={req.reason}
                    seat={req.lnsSeat}
                    lnsReq={req.lnsReq}
                    status={req.status}
                    showDeleteConfirm={() => setDeleteModalShow(true)}
                    setTargetNs={setTargetNs}
                />
                rr.push(row);
            });
        }
    } else {
        rr.push(
            <tr>
                <td className='table-danger' colSpan={7}>면불 신청 리스트를 받지 못했습니다.</td>
            </tr>
        )
    }

    const AREA = ['A', 'B', 'C', 'D', 'E', 'F'];

    function submit() {
        let state = 0;

        // validate
        if (!(
            timePreset === 0 && (
                revTime === 0 || revTime === 1 || revTime === 2
            ) ||
            timePreset === 1 && (
                revTime === 3 || revTime === 4 || revTime === 5 || revTime === 6
            )
        )) state = changeBit(state, 0);
        if (!inRange(1, 30, revPlace.length)) state = changeBit(state, 1);
        if (!inRange(1, 10, revSup.length)) state = changeBit(state, 2);
        if (!inRange(1, 30, revRes.length)) state = changeBit(state, 3);
        if (lnsRoomRequired && lnsSelected === -1) state = changeBit(state, 4);

        setFormState(state);

        if (state === 0) {
            setWorking(true);

            let lns: string | number;
            if (lnsSelected !== -1) {
                let seat = lnsSelected % 10;
                let area = (lnsSelected - seat) / 10
                lns = AREA[area - 1] + seat;
            } else {
                lns = -1;
            }

            ready('create_ns', token => {
                axios.post('/ns/api/nsr/create', {
                    time: revTime,
                    place: revPlace,
                    supervisor: revSup,
                    reason: revRes,
                    lnsReq: lnsRoomRequired,
                    lnsSeat: lns,
                    ctoken: token
                }).then(() => {
                    setSError(0);
                    loadNsReqs();
                    loadLns();
                }).catch(err => {
                    const code = err.response?.data['result'];
                    switch (code) {
                        case 4:
                            setSError(2);
                            break;
                        case 5:
                            setSError(3);
                            break;
                        case 6:
                            setSError(4);
                            break;
                        case 7:
                            setSError(5);
                            break;
                        case 8:
                            setSError(6);
                            break;
                        default:
                            setSError(1);
                            break;
                    }
                }).finally(() => {
                    setWorking(false);
                });
            });
        }
    }

    function deleteNs() {
        setDeleting(true);
        ready('delete_ns', token => {
            axios.delete('/ns/api/nsr/delete', {
                params: {
                    time: targetNs[0],
                    ctoken: token
                }
            })
                .then(() => {
                    closeDeleteConfirm();
                    loadNsReqs();
                    loadLns();
                })
                .catch(err => {
                    switch (err.response?.data['result']) {
                        case 1:
                            setDeleteResult(1);
                            break;
                        case 2:
                            setDeleteResult(2);
                            break;
                        case 3:
                            setDeleteResult(3);
                            break;
                        case 4:
                            setDeleteResult(4);
                            break;
                        default:
                            setDeleteResult(5);
                    }
                })
                .finally(() => {
                    setDeleting(false);
                });
        });
    }

    function closeDeleteConfirm() {
        setDeleteModalShow(false);
        setDeleteResult(-1);
    }

    function loadLns() {
        if (lnsRoomRequired) {
            axios.get('/ns/api/lns/get')
                .then(res => {
                    const dat = res.data['result'];
                    const tset: any[] = [];
                    // TODO: TYPE!
                    dat.forEach((ns: any) => {
                        let rp = {};
                        ns.forEach((e: any) => {
                            if (e['v']) {
                                // @ts-ignore
                                rp[e['sn']] = {
                                    name: e['name'],
                                    scode: e['scode']
                                };
                            }
                        });
                        tset.push(rp);
                    });
                    setSeatLst(tset);
                    setLnsError(1);
                })
                .catch(() => {
                    setLnsError(2);
                });
        }
    }

    function changeAf(state: boolean) {
        setAutoFill(state);
        let cs = localStorage.getItem('nsaf') as string;
        let pa = JSON.parse(cs);

        if (state) {
            pa[id] = {
                at: revPlace,
                sup: revSup,
                rea: revRes
            };
            localStorage.setItem('nsaf', JSON.stringify(pa));
        } else {
            delete pa[id];
            localStorage.setItem('nsaf', JSON.stringify(pa));
        }
    }

    return (
        <Container className='mt-5 nst'>
            <Row>
                <h4>{uName}님의 면불 신청</h4>
                <div className='table-cover'>
                    <Table className='table-wide'>
                        <thead>
                        <tr>
                            <th>면학</th>
                            <th>장소</th>
                            <th>담당교사</th>
                            <th>사유</th>
                            <th>노면실 자리</th>
                            <th>상태</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>{rr}</tbody>
                    </Table>
                </div>
                <p>{date}</p>
            </Row>
            <Row>
                <h4>면불 신청</h4>
                <Form className='mx-3'>
                    <Row className='mt-2'>
                        <Stack direction='horizontal' gap={4} className='stack-flow'>
                            <Stack direction='horizontal' gap={4}>
                                <Form.Group as={Col} className='mb-3'>
                                    <Form.Label htmlFor='time' className='form-label'>면학</Form.Label>
                                    <Form.Select
                                        isInvalid={getBit(formState, 0) === 1}
                                        aria-label='면학 시간'
                                        disabled={working}
                                        value={revTime}
                                        onChange={e => setRevTime(Number.parseInt(e.target.value))}>

                                        <option value={-1}>면학 시간</option>
                                        {timePreset === 0 &&
                                            <>
                                                <option value={0}>8면</option>
                                                <option value={1}>1면</option>
                                                <option value={2}>2면</option>
                                            </>
                                        }
                                        {timePreset === 1 &&
                                            <>
                                                <option value={3}>오후 1차</option>
                                                <option value={4}>오후 2차</option>
                                                <option value={5}>야간 1차</option>
                                                <option value={6}>야간 2차</option>
                                            </>
                                        }
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} className='mb-3'>
                                    <Form.Label htmlFor='place' className='form-label'>장소</Form.Label>
                                    <Form.Control
                                        type='text'
                                        isInvalid={getBit(formState, 1) === 1}
                                        value={revPlace}
                                        disabled={working}
                                        onChange={e => setRevPlace(e.target.value)}
                                    />
                                </Form.Group>
                            </Stack>
                            <Stack direction='horizontal' gap={4}>
                                <Form.Group as={Col} className='mb-3'>
                                    <Form.Label htmlFor='superviser' className='form-label'>담당교사</Form.Label>
                                    <Form.Control
                                        type='text'
                                        isInvalid={getBit(formState, 2) === 1}
                                        value={revSup}
                                        disabled={working}
                                        onChange={e => setRevSup(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} className='mb-3'>
                                    <Form.Label htmlFor='reason' className='form-label'>신청사유</Form.Label>
                                    <Form.Control
                                        type='text'
                                        isInvalid={getBit(formState, 3) === 1}
                                        value={revRes}
                                        disabled={working}
                                        onChange={e => setRevRes(e.target.value)}
                                    />
                                </Form.Group>
                            </Stack>
                        </Stack>
                    </Row>
                    <Row className='mx-3 mb-3'>
                        <Form.Check
                            label='자동완성'
                            id='autofill'
                            type='switch'
                            disabled={id === ''}
                            checked={autoFill}
                            onChange={(e) => changeAf(e.target.checked)}
                        />
                    </Row>
                    <Row className='mx-3 my-3'>
                        <Form.Check
                            label='노트북실 자리 예약'
                            isInvalid={getBit(formState, 4) === 1}
                            disabled={working} checked={lnsRoomRequired}
                            id='lnsRr'
                            onChange={e => setLnsRoomRequired(e.target.checked)}
                        />
                    </Row>
                    {lnsRoomRequired &&
                        <div className='mx-4 my-3 border p-3 lnst'>
                            <h5>노트북실 자리 예약</h5>
                            {revTime === -1 &&
                                <p className='my-0'>면불 시간을 선택해주세요.</p>
                            }
                            {revTime !== -1 &&
                                <LnsRoomSelect
                                    selected={lnsSelected}
                                    setSelected={(x: number) => setLnsSelected(x)} nst={revTime}
                                    lnsState={lnsError}
                                    seatLst={seatLst}
                                    reloadFunc={loadLns}
                                    timePreset={timePreset}
                                />
                            }
                        </div>
                    }
                    <Row className='mx-1 my-4'>
                        <Button className='w-auto' disabled={working} onClick={submit}>신청</Button>
                    </Row>
                    {sErrorState === 0 &&
                        <Alert variant='success'>
                            <p className='my-0'>신청되었습니다.</p>
                        </Alert>
                    }
                    {sErrorState === 1 &&
                        <Alert variant='danger'>
                            <p className='my-0'>신청하지 못했습니다.</p>
                        </Alert>
                    }
                    {sErrorState === 2 &&
                        <Alert variant='danger'>
                            <p className='my-0'>이미 신청한 시간입니다.</p>
                        </Alert>
                    }
                    {sErrorState === 3 &&
                        <Alert variant='danger'>
                            <p className='my-0'>이미 신청된 자리입니다.</p>
                        </Alert>
                    }
                    {sErrorState === 3 &&
                        <Alert variant='danger'>
                            <p className='my-0'>신청하지 못했습니다.</p>
                        </Alert>
                    }
                    {sErrorState === 4 &&
                        <Alert variant='danger'>
                            <p className='my-0'>reCAPTCHA 인증에 실패했습니다.</p>
                        </Alert>
                    }
                    {sErrorState === 5 &&
                        <Alert variant='danger'>
                            <p className='my-0'>사용자 보호를 위해 지금은 신청할 수 없습니다.</p>
                        </Alert>
                    }
                    {sErrorState === 6 &&
                        <Alert variant='danger'>
                            <p className='my-0'>교사로 등록되어있으므로 면불을 신청할 수 없습니다.</p>
                        </Alert>
                    }
                </Form>
            </Row>

            <Modal show={deleteModalShow} onHide={closeDeleteConfirm} dialogClassName='modal-dialog-centered'>
                <Modal.Header closeButton>
                    <Modal.Title>면불 취소</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteResult === -1 &&
                        <p>{targetNs[1]}에 신청된 면불을 취소할까요?</p>
                    }
                    {deleteResult !== -1 &&
                        <>
                            {deleteResult === 1 &&
                                <p className='bg-danger text-white p-3 rounded'>이 면불을 수정할 수 없습니다.</p>
                            }
                            {deleteResult === 2 &&
                                <p className='bg-danger text-white p-3 rounded'>이 시간에 신청된 면불이 없습니다.</p>
                            }
                            {deleteResult === 3 &&
                                <p className='bg-danger text-white p-3 rounded'>reCAPTCHA 확인에 실패했습니다.</p>
                            }
                            {deleteResult === 4 &&
                                <p className='bg-danger text-white p-3 rounded'>사용자 보호를 위해 지금은 면불을 취소할 수 없습니다.</p>
                            }
                            {deleteResult === 5 &&
                                <p className='bg-danger text-white p-3 rounded'>취소하지 못했습니다.</p>
                            }
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {deleteResult === -1 &&
                        <>
                            <Button onClick={deleteNs} disabled={deleting}>예</Button>
                            <Button onClick={closeDeleteConfirm} disabled={deleting}>아니오</Button>
                        </>
                    }
                    {deleteResult !== -1 &&
                        <>
                            <Button onClick={deleteNs} disabled={deleting}>다시 시도</Button>
                            <Button onClick={closeDeleteConfirm} disabled={deleting}>취소</Button>
                        </>
                    }
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default Ns;
