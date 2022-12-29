import TextInput from "../elements/input";
import Input from "../elements/input";
import {Link} from "react-router-dom";
import React from "react";

function SignupBox() {
    function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log('sdfg');
    }

    return (
        <div className={'signup-box'}>
            <h1>Ion</h1>
            <h3>Ion 회원가입</h3>
            <form method={'post'} action={'/auth/api/auth-session'} onSubmit={submitForm}>
                <fieldset>
                    <Input autoFocus={true} autoComplete={'name'} placeholder={'이름'}/>
                </fieldset>
                <fieldset className={'center'}>
                    <button type={'submit'}>다음</button>
                </fieldset>
                <div>
                    <Link to={'/docs/eula'} className={'signup'}>이용약관</Link>
                    <span>&bull;</span>
                    <Link to={'/docs/rules'} className={'signup'}>규칙</Link>
                </div>
            </form>
        </div>
    );
}

export default SignupBox;