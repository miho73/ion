import React, {useState} from 'react';
import {inRange} from '../../service/checker';
import {changeBit, getBit} from '../../service/bitmask';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {FloatingLabel, Form, FormLabel, InputGroup} from 'react-bootstrap';
import {ready} from '../../service/recaptcha';
import CaptchaNotice from '../fragments/captchaNotice';
import Credit from '../fragments/credit';

function SignupPage() {
    const [name, setName] = useState('');
    const [grade, setGrade] = useState(1);
    const [clas, setClas] = useState(1);
    const [sCode, setSCode] = useState(1);
    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdRe, setPWdRe] = useState('');
    const [eula, setEula] = useState(false);

    const [block, setBlock] = useState(false);
    const [page, setPage] = useState(0);
    const [formState, setFormState] = useState(0);

    const [createError, setCreateError] = useState(0);

    function validation(page: number) {
        let state = 0;

        if (page === 0) {
            if (!inRange(1, 10, name.length)) state = changeBit(state, 0);
            if (!inRange(1, 3, grade)) state = changeBit(state, 1);
            if (!inRange(1, 4, clas)) state = changeBit(state, 2);
            if (!inRange(1, 24, sCode)) state = changeBit(state, 3);
        } else if (page === 1) {
            if (!inRange(4, 30, id.length)) state = changeBit(state, 4);
            if (!inRange(6, 100, pwd.length)) state = changeBit(state, 7);
            if (pwd !== pwdRe) state = changeBit(state, 9);
        } else return 0;

        return state;
    }

    function sPg(page: number, op: number) {
        // page 2. async check
        let st = validation(op);
        if (op !== 1) {
            setFormState(st);
            if (st === 0 && inRange(0, 2, page)) setPage(page);
        } else {
            if (getBit(st, 4) || getBit(st, 7) || getBit(st, 9)) {
                setFormState(st);
            } else {
                axios.get('/user/api/validation/id-duplication', {
                    params: {id: id}
                }).then(res => {
                    if (res.data['result'] === 0) {
                        if (inRange(0, 2, page)) setPage(page);
                    } else {
                        st = changeBit(st, 5);
                    }
                }).catch(() => {
                    st = changeBit(st, 6);
                }).finally(() => {
                    setFormState(st);
                });
            }
        }
    }

    const navigate = useNavigate();

    function submit() {
        if (!eula) {
            let st = 0;
            st = changeBit(st, 8);
            setFormState(st);
            return;
        }
        setBlock(true);
        ready('signup', token => {
            axios.post('/user/api/create', {
                name: name,
                grade: grade,
                clas: clas,
                scode: sCode,
                id: id,
                pwd: pwd,
                ctoken: token
            }).then(() => {
                navigate('/docs/activation');
            }).catch(err => {
                switch (err.response?.data['result']) {
                    case 1:
                    case 2:
                        setCreateError(1);
                        break;
                    case 3:
                        setCreateError(2);
                        break;
                    case 4:
                        setCreateError(3);
                        break;
                }
            }).finally(() => {
                setBlock(false);
            });
        });
    }

    const yrs = new Date().getFullYear();

    return (
        <main className='container mt-4'>
            <Form className='text-center d-flex justify-content-center m-auto flex-column form-signin'>
                <h1 className='h3 mt-3 mb-0 fw-normal'>IonID 만들기</h1>
                <p className='mb-3 mt-0 fs-5'>Create IonID</p>

                {page === 0 &&
                    <div id='page1' className='vstack gap-3 d-flex justify-content-center align-items-center'>
                        <FloatingLabel label='이름'>
                            <Form.Control type='text'
                                          className={'pe-5 form-control fs-6 form-control-lg' + (getBit(formState, 0) ? ' is-invalid' : '')}
                                          disabled={block}
                                          placeholder='이름'
                                          autoComplete='name'
                                          aria-label='이름'
                                          value={name}
                                          onChange={e => setName(e.target.value)}
                            />
                            <FormLabel htmlFor='name'>이름</FormLabel>
                            <p className='invalid-feedback mb-0'>이름을 입력해주세요.</p>
                        </FloatingLabel>
                        <InputGroup>
                            <FloatingLabel label='학년'>
                                <Form.Control type='number'
                                              className={'pe-5 fs-6' + (getBit(formState, 1) ? ' is-invalid' : '')}
                                              disabled={block}
                                              placeholder='학년'
                                              aria-label='학년'
                                              value={grade}
                                              onChange={e => setGrade(Number.parseInt(e.target.value))}
                                />
                                <FormLabel htmlFor='grade'>학년</FormLabel>
                            </FloatingLabel>
                            <FloatingLabel label='반'>
                                <Form.Control type='number'
                                              className={'pe-5 fs-6' + (getBit(formState, 2) ? ' is-invalid' : '')}
                                              disabled={block}
                                              placeholder='반'
                                              aria-label='반'
                                              value={clas}
                                              onChange={e => setClas(Number.parseInt(e.target.value))}
                                />
                                <FormLabel htmlFor='clas'>반</FormLabel>
                            </FloatingLabel>
                            <FloatingLabel label='번호'>
                                <Form.Control type='number'
                                              className={'pe-5 fs-6' + (getBit(formState, 3) ? ' is-invalid' : '')}
                                              disabled={block}
                                              placeholder='번호'
                                              aria-label='번호'
                                              value={sCode}
                                              onChange={e => setSCode(Number.parseInt(e.target.value))}
                                />
                                <Form.Label htmlFor='scode'>번호</Form.Label>
                            </FloatingLabel>
                        </InputGroup>
                        {inRange(1, 3, grade) && inRange(1, 4, clas) && inRange(1, 24, sCode) &&
                            <div className='vstack'>
                                <p className='my-0'>{yrs - 1992 - grade}기의 {'' + grade + clas + (sCode < 10 ? '0' + sCode : sCode)}입니다.</p>
                            </div>
                        }
                    </div>
                }

                {page === 1 &&
                    <div id='page2' className='vstack gap-3 d-flex justify-content-center align-items-center'>
                        <FloatingLabel label='IonID'>
                            <Form.Control type='text'
                                          className={'pe-5 fs-6 form-control-lg' + (getBit(formState, 4) || getBit(formState, 5) || getBit(formState, 6) ? ' is-invalid' : '')}
                                          disabled={block}
                                          placeholder='IonID'
                                          autoComplete='username'
                                          aria-label='IonID'
                                          value={id}
                                          onChange={e => setId(e.target.value)}
                            />
                            {getBit(formState, 4) === 1 &&
                                <p className={'invalid-feedback mb-0'}>IonID는 4~30자로 골라주세요.</p>
                            }
                            {getBit(formState, 5) === 1 &&
                                <p className='invalid-feedback mb-0'>이 IonID는 이미 사용중이예요.</p>
                            }
                            {getBit(formState, 6) === 1 &&
                                <p className='invalid-feedback mb-0'>IonID 중복확인에 실패했어요.</p>
                            }
                        </FloatingLabel>
                        <FloatingLabel label='Password'>
                            <Form.Control type='password'
                                          className={'pe-5 fs-6 form-control-lg' + (getBit(formState, 7) ? ' is-invalid' : '')}
                                          disabled={block}
                                          placeholder='Password'
                                          autoComplete='new-password'
                                          aria-label='Password'
                                          value={pwd}
                                          onChange={e => setPwd(e.target.value)}
                            />
                            <p className='invalid-feedback mb-0'>암호는 6자 이상이어야 합니다.</p>
                        </FloatingLabel>
                        <FloatingLabel label='Confirm Password'>
                            <Form.Control type='password'
                                          className={'pe-5 fs-6 form-control-lg' + (getBit(formState, 9) ? ' is-invalid' : '')}
                                          disabled={block}
                                          placeholder='Confirm Password'
                                          autoComplete='new-password'
                                          aria-label='Confirm Password'
                                          value={pwdRe}
                                          onChange={e => setPWdRe(e.target.value)}
                            />
                            <p className='invalid-feedback mb-0'>암호를 확인해주세요.</p>
                        </FloatingLabel>
                    </div>
                }

                {page === 2 &&
                    <div id='page2' className='vstack gap-3 d-flex justify-content-center align-items-center'>
                        <p className='my-0'>IonID를 만들면 Ion의 <Link to='/docs/eula' target='_blank'>이용약관</Link>에 동의하게 됩니다.
                        </p>
                        <div className='form-check'>
                            <input className={'form-check-input' + (getBit(formState, 8) ? ' is-invalid' : '')}
                                   type='checkbox' value='' id='eula-agr' checked={eula}
                                   onChange={e => setEula(e.target.checked)}/>
                            <label className='form-check-label' htmlFor='eula-agr'>이용약관을 읽었고 동의합니다.</label>
                        </div>
                    </div>
                }

                <div className='btn-group mt-3 mx-auto'>
                    {page !== 0 &&
                        <button type='button' className='btn btn-outline-primary' disabled={block}
                                onClick={() => sPg(page - 1, page)}>이전</button>
                    }
                    {page !== 2 &&
                        <button type='button' className='btn btn-outline-primary' disabled={block}
                                onClick={() => sPg(page + 1, page)}>다음</button>
                    }
                    {page === 2 &&
                        <button type='button' className='btn btn-outline-primary fs-6' disabled={block}
                                onClick={submit}>회원가입</button>
                    }
                </div>
                {createError === 1 &&
                    <div className='alert alert-danger mt-5'>
                        <p className='mb-0'>올바르지 않은 요청입니다.</p>
                    </div>
                }
                {createError === 1 &&
                    <div className='alert alert-danger mt-5'>
                        <p className='mb-0'>reCAPTCHA 확인에 실패했습니다.</p>
                    </div>
                }
                {createError === 1 &&
                    <div className='alert alert-danger mt-5'>
                        <p className='mb-0'>사용자 보호를 위해 지금은 회원가입할 수 없습니다.</p>
                    </div>
                }
                <Link to='/' className='my-4 text-muted text-decoration-none'>기존 IonID로 로그인</Link>
                <CaptchaNotice/>
                <Credit className='mt-4'/>
            </Form>
        </main>
    )
}

export default SignupPage;