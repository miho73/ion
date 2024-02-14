import axios from 'axios';
import React, {useState} from 'react'
import {Button, Form, Modal, Spinner, Stack} from 'react-bootstrap';

function Promote() {
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [workState, setWorkState] = useState(-1);
    const [challengeN, setChallengeN] = useState(-1);
    const [userChallenge, setUserChallenge] = useState(0);
    const [working, setWorking] = useState(false);

    function startPromote() {
        setConfirmModalShow(true);
        setWorkState(-1);
        setUserChallenge(0);
        setChallengeN(Math.round(Math.random() * 100) + 10)
    }

    function closeConfirmModal() {
        setConfirmModalShow(false);
    }

    function beginWork() {
        if (challengeN * (challengeN + 1) !== userChallenge * 2) {
            setWorkState(1);
            return;
        }
        setWorking(true);
        axios.patch('/manage/api/bulk/promote')
            .then(res => {
                setWorkState(2);
            })
            .catch(err => {
                setWorkState(3);
            })
            .finally(() => {
                setWorking(false);
            });
    }

    return (
        <>
            <Stack>
                <p className='m-1'>이 작업의 결과</p>
                <ul className='m-1'>
                    <li>기존 1, 2학년 학생들의 학년이 1씩 증가합니다.</li>
                    <li>기존 1, 2학년 학생들의 학번이 초기화되며 재설정하도록 요구합니다.</li>
                    <li>기존 3학년 학생들의 IonID가 삭제됩니다.</li>
                </ul>
                <Button variant='outline-primary w-fit my-2' onClick={startPromote}>진급 시작</Button>
            </Stack>
            <Modal show={confirmModalShow} dialogClassName='modal-dialog-centered'>
                <Modal.Header>
                    <Modal.Title>진급</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!working &&
                        <>
                            {(workState === -1 || workState === 1) &&
                                <>
                                    <p className='m-1'>진급 작업을 시작합니다. 그 결과</p>
                                    <ul className='m-1'>
                                        <li>기존 1, 2학년 학생들의 학년이 1씩 증가합니다.</li>
                                        <li>기존 1, 2학년 학생들의 학번이 초기화되며 재설정하도록 요구합니다.</li>
                                        <li>기존 3학년 학생들의 IonID가 삭제됩니다.</li>
                                    </ul>
                                    <p className='m-1'>진급을 시작하려면 아래에 1 ≤ N ≤ {challengeN} 인 자연수 N의 총합을 입력하세요.</p>
                                    <Form.Control
                                        type='number'
                                        value={userChallenge}
                                        placeholder='총합'
                                        onChange={e => setUserChallenge(Number.parseInt(e.target.value))}
                                    />
                                    {workState === 1 &&
                                        <p className='m-1 text-danger'>정답이 아닙니다.</p>
                                    }
                                </>
                            }
                            {workState === 2 &&
                                <div className='d-flex flex-column align-items-center'>
                                    <p className='my-1'>진급 처리가 완료되었습니다.</p>
                                </div>
                            }
                            {workState === 3 &&
                                <div className='d-flex flex-column align-items-center'>
                                    <p className='my-1'>진급 처리중 문제가 생겼습니다.</p>
                                    <p className='my-1'>모든 작업이 취소되었습니다.</p>
                                </div>
                            }
                        </>
                    }
                    {working &&
                        <div className='d-flex flex-column align-items-center'>
                            <Spinner animation='grow'/>
                            <p className='my-3'>작업중입니다.</p>
                        </div>
                    }
                </Modal.Body>
                {!working &&
                    <Modal.Footer>
                        {(workState === -1 || workState === 1) &&
                            <>
                                <Button onClick={beginWork}>확인</Button>
                                <Button onClick={closeConfirmModal}>취소</Button>
                            </>
                        }
                        {(workState === 2 || workState === 3) &&
                            <>
                                <Button onClick={closeConfirmModal}>닫기</Button>
                            </>
                        }
                    </Modal.Footer>
                }
            </Modal>
        </>
    );
}

export default Promote;