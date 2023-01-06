import { Input, FormError } from "../elements/input";
import { Link } from "react-router-dom";
import React, {useState} from "react";
import { HList, VList } from "../elements/layout";

import SignupService from "../services/AuthService";
import {errorBitmask, rangeValidation} from "../lib/validation";
import authService from "../services/AuthService";

function SignupBox() {
    const [name, updateName] = useState<string>('');
    const [grade, updateGrade] = useState<number>(0);
    const [clas, updateClas] = useState<number>(0);
    const [stuCode, updateStuCode] = useState<number>();
    const [id, updateId] = useState<string>('');
    const [pwd, updatePwd] = useState<string>('');
    const [pwdRepeat, updatePwdRepeat] = useState<string>('');
    const [errorState, updateErrorState] = useState<number>(0);
    const [errorMsg, updateErrorMsg] = useState<string>('');
    const [formError, updateFormError] = useState<number>(0);

    const checkForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        let formState = 0;

        if(rangeValidation(name.length, 2, 50))
            formState = errorBitmask(formState, 0);

        if(rangeValidation(grade, 0, 2) ||
           rangeValidation(clas, 0, 3) ||
           rangeValidation(stuCode === undefined ? 0 : stuCode, 1, 30))
            formState = errorBitmask(formState, 1);

        if(rangeValidation(id.length, 4, 30))
            formState = errorBitmask(formState, 2);
        if(rangeValidation(pwd.length, 6, 50))
            formState = errorBitmask(formState, 3);
        if(pwd !== pwdRepeat)
            formState = errorBitmask(formState, 4);
        updateFormError(formState);
        if(formState !== 0) return;

        // id validation preflight
        authService.preflight(id).then(res => {
            if(res.data.result) {
                formState = errorBitmask(formState, 5);
                updateFormError(formState);
            }
            else {
                submitIdentity();
            }
        }).catch(err => {
            switch (err.response.data.code) {
                case 400:
                    updateErrorMsg('ID 확인요청이 유효하지 않습니다.');
                    break;
                case 500:
                    updateErrorMsg('ID를 확인하지 못했습니다.');
                    break;
            }
            console.error(err);
            updateErrorState(1);
        });
    }

    const submitIdentity = () => {
        let identity = {
            name: name,
            grade: grade+1,
            classroom: clas+1,
            studentCode: stuCode,
            id: id,
            password: pwd
         };
        SignupService.submitIdentity(identity).then(res => {
            console.log(res);
        }).catch(err => {
            switch (err.response.data.code) {
                case 400:
                    updateErrorMsg('요청이 유효하지 않습니다.');
                    break;
                case 500:
                    updateErrorMsg('Ion ID를 만들지 못했습니다.');
                    break;
            }
            console.error(err);
            updateErrorState(1);
        });
    }
    return (
        <div className={'signup-box'}>
            <h1>Ion ID 만들기</h1>
            <p>하나의 Ion ID로 Ion의 모든 서비스를 이용하실 수 있습니다.</p>
            <form method={'post'} action={'/auth/api/user/create'}>
                <fieldset>
                    <VList>
                        <Input autoFocus={true}
                               autoComplete={'name'}
                               placeholder={'이름'}
                               value={name}
                               stateUpdate={updateName}
                        />
                        <FormError errorFlag={formError} place={0}>이름은 2자에서 50자 사이여야 합니다.</FormError>
                    </VList>
                </fieldset>
                <hr/>
                <fieldset>
                    <VList>
                        <p className={'fsh'}>학교 정보</p>
                        <HList>
                            <select value={grade}
                                    onChange={(e) => updateGrade(e.target.selectedIndex)}
                                    title={'학년'}>
                                <option value={0}>1학년</option>
                                <option value={1}>2학년</option>
                                <option value={2}>3학년</option>
                            </select>
                            <select value={clas}
                                    onChange={(e) => updateClas(e.target.selectedIndex)}
                                    title={'학급'}>
                                <option value={0}>1반</option>
                                <option value={1}>2반</option>
                                <option value={2}>3반</option>
                                <option value={3}>4반</option>
                            </select>
                            <Input type={'number'}
                                   value={stuCode}
                                   stateUpdate={updateStuCode}
                                   placeholder={'번호'}
                                   len={30}
                            />
                        </HList>
                        <FormError errorFlag={formError} place={1}>올바른 학급 정보를 입력해야 합니다.</FormError>
                        <p className={'caption'}>계정 활성화 단계에서 이 정보가 사용됩니다.</p>
                    </VList>
                </fieldset>
                <hr/>
                <fieldset>
                    <Input value={id}
                           autoComplete={'username'}
                           stateUpdate={updateId}
                           placeholder={'Ion ID'}
                    />
                    <FormError errorFlag={formError} place={2}>Ion ID는 4자에서 30자 사이여야 합니다.</FormError>
                    <FormError errorFlag={formError} place={5}>이 Ion ID는 이미 사용중입니다.</FormError>
                    <p className={'caption'}>새 Ion ID로 사용됩니다.</p>
                    <Input type={'password'}
                           value={pwd}
                           autoComplete={'new-password'}
                           stateUpdate={updatePwd}
                           placeholder={'암호'}
                    />
                    <FormError errorFlag={formError} place={3}>암호는 적어도 6자 이상이여야 합니다.</FormError>
                    <Input type={'password'}
                           value={pwdRepeat}
                           autoComplete={'new-password'}
                           stateUpdate={updatePwdRepeat}
                           placeholder={'암호 확인'}
                    />
                    <FormError errorFlag={formError} place={4}>암호가 일치하지 않습니다.</FormError>
                </fieldset>
                <hr/>
                <div className={'form-foot'}>
                    <VList>
                        <div className={'center'}>
                            <button type={'submit'} onClick={checkForm}>다음</button>
                        </div>
                        { errorState !== 0 &&
                            <div className={'error-box'}>
                                <p>{errorMsg}</p>
                            </div>
                        }
                        <div className={'docs'}>
                            <Link to={'/docs/eula'} className={'signup'}>이용약관</Link>
                            <span>&bull;</span>
                            <Link to={'/docs/rules'} className={'signup'}>규칙</Link>
                        </div>
                        <p className={'notice'}>Ion ID를 생성함에 따라 이상의 이용약관과 규칙을 읽고 동의함을 확인하는 것입니다. Ion이 개인정보를 처리하는 방식에 대해서는 "규칙"의 "개인정보처리방침"을 참고하세요.</p>
                    </VList>
                </div>
            </form>
        </div>
    );
}

export default SignupBox;