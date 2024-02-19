import React, {useEffect, useState, KeyboardEvent} from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import CaptchaNotice from '../../fragments/captchaNotice'
import Credit from '../../fragments/credit'
import {inRange} from '../../../service/checker';
import {changeBit, getBit} from '../../../service/bitmask';
import {ready} from '../../../service/recaptcha';
import axios from 'axios';
import {Stack} from "react-bootstrap";

import {ReactComponent as FidoIcon} from '../../../../assets/icons/FIDO_Passkey_mark_A_white.svg';
import {startAuthentication} from "@simplewebauthn/browser";


const RECAPTCHA_CHECKBOX_KEY = process.env.REACT_APP_CAPTCHA_CHECKBOX_KEY;

type LoginSectionProps = {
    setChangeFlag: (flag: boolean) => void;
}

function LoginSection(props: LoginSectionProps) {
    const [id, setId] = useState<string>('');
    const [pwd, setPwd] = useState<string>('');
    const [block, setBlock] = useState<boolean>(false);
    const [formState, setFormState] = useState<number>(0);
    const [loginError, setLoginError] = useState<number>(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [shouldTryCheckbox, setShouldTryCheckbox] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(shouldTryCheckbox) {
            // @ts-ignore
            grecaptcha.enterprise.render(document.getElementById('recaptcha-field'), {
                'sitekey' : RECAPTCHA_CHECKBOX_KEY,
                'action': 'login',
            });
        }
    }, [shouldTryCheckbox]);

    function submit() {
        let state = 0;
        if (!inRange(1, 30, id.length)) state = changeBit(state, 0);
        if (!inRange(1, 30, pwd.length)) state = changeBit(state, 1);
        if(shouldTryCheckbox) {
            // @ts-ignore
            let token = grecaptcha.enterprise.getResponse();
            if(token === '') {
                state = changeBit(state, 2);
            }
        }
        setFormState(state);

        if (state !== 0) return;

        setBlock(true);
        ready('login', token => {
            let tok = token;
            if(shouldTryCheckbox) {
                // @ts-ignore
                tok = grecaptcha.enterprise.getResponse();
            }

            axios.post('/auth/api/authenticate', {
                id: id,
                pwd: pwd,
                ctoken: tok,
                checkbox: shouldTryCheckbox
            }).then(res => {
                let re = res.data['result'];
                if (re === 0) {
                    if(searchParams.has('ret')) {
                        // @ts-ignore
                        navigate(searchParams.get('ret'));
                    }
                    else window.location.reload();
                } else if (re === 7) {
                    props.setChangeFlag(true);
                } else if(re === 6) {
                    if(!shouldTryCheckbox) {
                        setShouldTryCheckbox(true);
                        setLoginError(-3);
                    }
                    else {
                        setLoginError(6);
                    }
                } else setLoginError(re);

                if(shouldTryCheckbox) {
                    // @ts-ignore
                    grecaptcha.enterprise.reset();
                }
            }).catch(err => {
                setLoginError(-1);
            }).finally(() => {
                setBlock(false);
            });
        });
    }

    function enterDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submit();
        }
    }

    function passkeyLogin() {
        axios.get('/auth/api/passkey/authentication/options/get')
            .then(res => {
                let options = res.data.result['publicKey'];
                if(options === null) {
                    setLoginError(100);
                    return;
                }
                startAuthentication(options).then(passkeySuccess)
                    .catch(e => {
                       console.error(e);
                    });
            })
            .catch(() => {
                setLoginError(100);
            });
    }
    function passkeySuccess(res: object) {
        axios.post('/auth/api/passkey/authentication/complete', res)
            .then(res => {
                if(res.data['result'] === 9) {
                    props.setChangeFlag(true);
                }
                else if (res.data['result'] === 0) {
                    if(searchParams.has('ret')) {
                        // @ts-ignore
                        navigate(searchParams.get('ret'));
                    }
                    else window.location.reload();
                }
            })
            .catch(res => {
                switch (res.response?.data['result']) {
                    case 1:
                        setLoginError(102);
                        break;
                    case 2:
                        setLoginError(103);
                        break;
                    case 3:
                        setLoginError(104);
                        break;
                    case 4:
                        setLoginError(105);
                        break;
                    case 5:
                        setLoginError(1);
                        break;
                    case 6:
                        setLoginError(2);
                        break;
                    case 7:
                        setLoginError(3);
                        break;
                    default:
                        setLoginError(101);
                }
            });
    }

    return (
        <form className='vstack gap-3 d-flex justify-content-center align-items-center text-center form-signin'>
            <h1 className='h3 my-3 fw-normal'>IonID</h1>
            <div className='form-floating'>
                <input type='text'
                       className={'pe-5 form-control fs-6 form-control-lg' + (getBit(formState, 0) ? ' is-invalid' : '')}
                       disabled={block} id='ionid' placeholder='IonID' autoComplete='username' aria-label='IonID'
                       value={id} onChange={e => setId(e.target.value)} onKeyDown={enterDown}/>
                <label htmlFor='ionid'>IonID</label>
            </div>
            <div className='form-floating'>
                <input type='password'
                       className={'pe-5 form-control fs-6 form-control-lg' + (getBit(formState, 1) ? ' is-invalid' : '')}
                       disabled={block} id='pwd' placeholder='암호' autoComplete='current-password' aria-label='암호'
                       value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={enterDown}/>
                <label htmlFor='pwd'>Password</label>
            </div>
            {shouldTryCheckbox &&
                <div className={'form-floating my-2'}>
                    <div id={'recaptcha-field'} className="g-recaptcha"></div>
                </div>
            }
            <button className='btn btn-lg btn-primary fs-6' type='button' onClick={submit} disabled={block}>Sign in</button>
            <button className='btn btn-lg btn-secondary fs-6' type='button' onClick={passkeyLogin} disabled={block}>
                <FidoIcon className={'icon'}/>
                <span>Passkey로 로그인</span>
            </button>
            {loginError !== 0 &&
                <div className='alert alert-danger mt-2'>
                    {loginError === -1 &&
                        <p className='mb-0'>로그인하지 못했습니다.</p>
                    }
                    {(loginError === 1 || loginError === 4) &&
                        <p className='mb-0'>IonID 또는 암호가 잘못되었습니다.</p>
                    }
                    {loginError === 2 &&
                        <p className='mb-0'>IonID가 비활성화 상태입니다.</p>
                    }
                    {loginError === 3 &&
                        <p className='mb-0'>이 IonID로 로그인 할 수 없습니다.</p>
                    }
                    {loginError === 5 &&
                        <p className='mb-0'>reCAPTCHA를 확인하지 못했습니다.</p>
                    }
                    { loginError === -3 &&
                        <p className='mb-0'>사용자 보호를 위해 추가 인증이 필요합니다.</p>
                    }
                    { loginError === 6 &&
                        <>
                            <p className='mb-2'>사용자 보호를 위해 로그인할 수 없습니다.</p>
                            <p className='mb-0'>잠시 뒤에 다시 시도해주세요.</p>
                        </>
                    }
                    { loginError === 100 &&
                        <p className='mb-0'>Passkey로 로그인할 수 없습니다.</p>
                    }
                    { loginError === 101 &&
                        <p className='mb-0'>Passkey로 로그인하지 못했습니다.</p>
                    }
                    { loginError === 102 &&
                        <p className='mb-0'>Passkey 인증정보가 없습니다.</p>
                    }
                    { loginError === 103 &&
                        <p className='mb-0'>Passkey를 신뢰할 수 없습니다.</p>
                    }
                    { loginError === 104 &&
                        <p className='mb-0'>Passkey로 인증하지 못했습니다.</p>
                    }
                    { loginError === 105 &&
                        <p className='mb-0'>제시한 Passkey를 찾을 수 없습니다.</p>
                    }

                </div>
            }
            <Stack direction='horizontal' className='gap-3 justify-content-center mt-2 mb-4'>
                <Link to={'/auth/signup'} className='text-muted text-decoration-none fs-6'>IonID 만들기</Link>
                <Link to={'/auth/iforgot'} className='text-muted text-decoration-none fs-6'>암호 찾기</Link>
            </Stack>
            <CaptchaNotice/>
            <Credit/>
        </form>
    )
}

export default LoginSection;
