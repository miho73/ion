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
                    updateErrorMsg('ID ??????????????? ???????????? ????????????.');
                    break;
                case 500:
                    updateErrorMsg('ID??? ???????????? ???????????????.');
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
                    updateErrorMsg('????????? ???????????? ????????????.');
                    break;
                case 500:
                    updateErrorMsg('Ion ID??? ????????? ???????????????.');
                    break;
            }
            console.error(err);
            updateErrorState(1);
        });
    }
    return (
        <div className={'signup-box'}>
            <h1>Ion ID ?????????</h1>
            <p>????????? Ion ID??? Ion??? ?????? ???????????? ???????????? ??? ????????????.</p>
            <form method={'post'} action={'/auth/api/user/create'}>
                <fieldset>
                    <VList>
                        <Input autoFocus={true}
                               autoComplete={'name'}
                               placeholder={'??????'}
                               value={name}
                               stateUpdate={updateName}
                        />
                        <FormError errorFlag={formError} place={0}>????????? 2????????? 50??? ???????????? ?????????.</FormError>
                    </VList>
                </fieldset>
                <hr/>
                <fieldset>
                    <VList>
                        <p className={'fsh'}>?????? ??????</p>
                        <HList>
                            <select value={grade}
                                    onChange={(e) => updateGrade(e.target.selectedIndex)}
                                    title={'??????'}>
                                <option value={0}>1??????</option>
                                <option value={1}>2??????</option>
                                <option value={2}>3??????</option>
                            </select>
                            <select value={clas}
                                    onChange={(e) => updateClas(e.target.selectedIndex)}
                                    title={'??????'}>
                                <option value={0}>1???</option>
                                <option value={1}>2???</option>
                                <option value={2}>3???</option>
                                <option value={3}>4???</option>
                            </select>
                            <Input type={'number'}
                                   value={stuCode}
                                   stateUpdate={updateStuCode}
                                   placeholder={'??????'}
                                   len={30}
                            />
                        </HList>
                        <FormError errorFlag={formError} place={1}>????????? ?????? ????????? ???????????? ?????????.</FormError>
                        <p className={'caption'}>?????? ????????? ???????????? ??? ????????? ???????????????.</p>
                    </VList>
                </fieldset>
                <hr/>
                <fieldset>
                    <Input value={id}
                           autoComplete={'username'}
                           stateUpdate={updateId}
                           placeholder={'Ion ID'}
                    />
                    <FormError errorFlag={formError} place={2}>Ion ID??? 4????????? 30??? ???????????? ?????????.</FormError>
                    <FormError errorFlag={formError} place={5}>??? Ion ID??? ?????? ??????????????????.</FormError>
                    <p className={'caption'}>??? Ion ID??? ???????????????.</p>
                    <Input type={'password'}
                           value={pwd}
                           autoComplete={'new-password'}
                           stateUpdate={updatePwd}
                           placeholder={'??????'}
                    />
                    <FormError errorFlag={formError} place={3}>????????? ????????? 6??? ??????????????? ?????????.</FormError>
                    <Input type={'password'}
                           value={pwdRepeat}
                           autoComplete={'new-password'}
                           stateUpdate={updatePwdRepeat}
                           placeholder={'?????? ??????'}
                    />
                    <FormError errorFlag={formError} place={4}>????????? ???????????? ????????????.</FormError>
                </fieldset>
                <hr/>
                <div className={'form-foot'}>
                    <VList>
                        <div className={'center'}>
                            <button type={'submit'} onClick={checkForm}>??????</button>
                        </div>
                        { errorState !== 0 &&
                            <div className={'error-box'}>
                                <p>{errorMsg}</p>
                            </div>
                        }
                        <div className={'docs'}>
                            <Link to={'/docs/eula'} className={'signup'}>????????????</Link>
                            <span>&bull;</span>
                            <Link to={'/docs/rules'} className={'signup'}>??????</Link>
                        </div>
                        <p className={'notice'}>Ion ID??? ???????????? ?????? ????????? ??????????????? ????????? ?????? ???????????? ???????????? ????????????. Ion??? ??????????????? ???????????? ????????? ???????????? "??????"??? "????????????????????????"??? ???????????????.</p>
                    </VList>
                </div>
            </form>
        </div>
    );
}

export default SignupBox;