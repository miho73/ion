import {Input} from "../elements/input";
import {Link} from "react-router-dom";
import React, {useState} from "react";

function AuthBox() {
    function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log('sdf');
    }

    const [id, updateId] = useState<string>('');
    const [pwd, updatePwd] = useState<string>('');

    return (
        <div className={'auth-box'}>
            <h1>Ion</h1>
            <h3>Ion 로그인</h3>
            <form method={'post'} action={'/auth/api/session'} onSubmit={submitForm}>
                <fieldset>
                    <Input autoFocus={true}
                           autoComplete={'username'}
                           placeholder={'Ion ID'}
                           stateUpdate={updateId}
                    />
                    <Input type={'password'}
                           autoFocus={false}
                           autoComplete={'current-password'}
                           placeholder={'Password'}
                           stateUpdate={updatePwd}
                    />
                </fieldset>
                <fieldset className={'center'}>
                    <button type={'submit'}>로그인</button>
                </fieldset>
                <div>
                    <Link to={'/signup'} className={'signup'}>Not a member</Link>
                    <span>&bull;</span>
                    <Link to={'/forgot'} className={'signup'}>Forgot Ion ID or Password</Link>
                </div>
            </form>
        </div>
    );
}

export default AuthBox;