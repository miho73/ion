import React, {useState} from 'react';
import {inRange} from '../../service/checker';
import {changeBit, getBit} from '../../service/bitmask';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {Alert, Button, ButtonGroup, FloatingLabel, Form, InputGroup, Stack} from 'react-bootstrap';
import {ready} from '../../service/recaptcha';
import CaptchaNotice from '../fragments/captchaNotice';
import Credit from '../fragments/credit';

function SignupPage() {
  const [name, setName] = useState<string>('');

  const [grade, setGrade] = useState<number | undefined>();
  const [clas, setClas] = useState<number | undefined>();
  const [sCode, setSCode] = useState<number | undefined>();

  const [id, setId] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [pwdRe, setPWdRe] = useState<string>('');
  const [eula, setEula] = useState<boolean>(false);

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
  let classInfTxt = '';
  if (grade !== undefined && clas !== undefined && sCode !== undefined) {
    classInfTxt = `${yrs - 1992 - grade}기의 ${'' + grade + clas + (sCode < 10 ? '0' + sCode : sCode)}입니다.`
  }

  return (
    <Form className={'mx-auto d-flex flex-column align-items-center gap-2 auth'}>
      <p className={'display-6 my-2'}>IonID</p>
      <p className='mb-3 fs-5'>Create IonID</p>

      {page === 0 &&
        <Stack gap={3} className={'align-items-center'}>
          <FloatingLabel label='이름'>
            <Form.Control type='text'
                          className={'pe-5 fs-6'}
                          disabled={block}
                          placeholder='이름' aria-label='이름'
                          autoComplete='name'
                          value={name} onChange={e => setName(e.target.value)}
                          isInvalid={getBit(formState, 0) === 1}
            />
            <Form.Control.Feedback type={'invalid'}>이름을 입력해주세요.</Form.Control.Feedback>
          </FloatingLabel>
          <InputGroup>
            <FloatingLabel label='학년'>
              <Form.Control type='number'
                            className={'pe-5 fs-6'}
                            disabled={block}
                            placeholder='학년' aria-label='학년'
                            value={grade} onChange={e => setGrade(Number.parseInt(e.target.value))}
                            isInvalid={getBit(formState, 1) === 1}
              />
            </FloatingLabel>
            <FloatingLabel label='반'>
              <Form.Control type='number'
                            className={'pe-5 fs-6'}
                            disabled={block}
                            placeholder='반' aria-label='반'
                            value={clas} onChange={e => setClas(Number.parseInt(e.target.value))}
                            isInvalid={getBit(formState, 2) === 1}
              />
            </FloatingLabel>
            <FloatingLabel label='번호'>
              <Form.Control type='number'
                            className={'pe-5 fs-6'}
                            disabled={block}
                            placeholder='번호' aria-label='번호'
                            value={sCode} onChange={e => setSCode(Number.parseInt(e.target.value))}
                            isInvalid={getBit(formState, 3) === 1}
              />
            </FloatingLabel>
          </InputGroup>

          {inRange(1, 3, grade) && inRange(1, 4, clas) && inRange(1, 24, sCode) &&
            <p>{classInfTxt}</p>
          }
        </Stack>
      }
      {page === 1 &&
        <Stack gap={3} className={'align-items-center'}>
          <FloatingLabel label='IonID'>
            <Form.Control type='text'
                          className={'pe-5 fs-6'}
                          disabled={block}
                          placeholder='IonID' aria-label='IonID'
                          autoComplete='username'
                          value={id} onChange={e => setId(e.target.value)}
                          isInvalid={getBit(formState, 4) === 1 || getBit(formState, 5) === 1 || getBit(formState, 6) === 1}
            />
            {getBit(formState, 4) === 1 &&
              <Form.Control.Feedback type={'invalid'}>IonID는 4~30자로 골라주세요.</Form.Control.Feedback>
            }
            {getBit(formState, 5) === 1 &&
              <Form.Control.Feedback type={'invalid'}>이 IonID는 이미 사용중이예요.</Form.Control.Feedback>
            }
            {getBit(formState, 6) === 1 &&
              <Form.Control.Feedback type={'invalid'}>IonID 중복확인에 실패했어요.</Form.Control.Feedback>
            }
          </FloatingLabel>
          <FloatingLabel label='Password'>
            <Form.Control type='password'
                          className={'pe-5 fs-6'}
                          disabled={block}
                          placeholder='Password' aria-label='Password'
                          autoComplete='new-password'
                          value={pwd} onChange={e => setPwd(e.target.value)}
                          isInvalid={getBit(formState, 7) === 1}
            />
            <Form.Control.Feedback type={'invalid'}>암호는 6자 이상이어야 합니다.</Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel label='Confirm Password'>
            <Form.Control type='password'
                          className={'pe-5 fs-6'}
                          disabled={block}
                          placeholder='Confirm Password' aria-label='Confirm Password'
                          autoComplete='new-password'
                          value={pwdRe} onChange={e => setPWdRe(e.target.value)}
                          isInvalid={getBit(formState, 9) === 1}
            />
            <Form.Control.Feedback type={'invalid'}>암호를 확인해주세요.</Form.Control.Feedback>
          </FloatingLabel>
        </Stack>
      }
      {page === 2 &&
        <Stack gap={3} className={'align-items-center'}>
          <p>IonID를 만들면 Ion의 <Link to='/docs/eula' target='_blank'>이용약관</Link>에 동의하게 됩니다.</p>
          <Form.Check type={'checkbox'}
                      id={'fc-eula'}
                      isInvalid={getBit(formState, 8) === 1}
                      checked={eula} onChange={e => setEula(e.target.checked)}
                      label={'이용약관을 잘 이해하였으며 이에 동의합니다.'}
          />
        </Stack>
      }
      <ButtonGroup className={'my-2'}>
        {page !== 0 &&
          <Button disabled={block} onClick={() => sPg(page - 1, page)}>이전</Button>
        }
        {page !== 2 &&
          <Button disabled={block} onClick={() => sPg(page + 1, page)}>다음</Button>
        }
        {page === 2 &&
          <Button disabled={block} onClick={submit}>회원가입</Button>
        }
      </ButtonGroup>

      {createError === 1 &&
        <Alert variant={'danger'}>
          <p>올바르지 않은 요청입니다.</p>
        </Alert>
      }
      {createError === 2 &&
        <Alert variant={'danger'}>
          <p>reCAPTCHA 확인에 실패했습니다.</p>
        </Alert>
      }
      {createError === 3 &&
        <Alert variant={'danger'}>
          <p>사용자 보호를 위해 지금은 회원가입할 수 없습니다.</p>
        </Alert>
      }
      <Link to='/' className={'my-2 text-muted text-decoration-none fs-6'}>기존 IonID로 로그인</Link>
      <CaptchaNotice className={'text-center my-1'}/>
      <Credit className='text-center my-1'/>
    </Form>
  )
}

export default SignupPage;
