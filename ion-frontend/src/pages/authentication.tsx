import TextInput from "../elements/input";
import Input from "../elements/input";
import {Link} from "react-router-dom";

function AuthBox() {
    return (
        <div className={'auth-box'}>
            <h1>Ion</h1>
            <h3>Ion 로그인</h3>
            <form>
                <fieldset>
                    <Input autoFocus={true} autoComplete={'username'} placeholder={'Ion ID'}/>
                    <Input type={'password'} autoFocus={false} autoComplete={'current-password'} placeholder={'Password'}/>
                </fieldset>
                <fieldset className={'center'}>
                    <button role={'submit'}>로그인</button>
                </fieldset>
                <div>
                    <Link to={'/signup'} className={'signup'}>Not a member</Link>
                    <span>&bull;</span>
                    <Link to={'/forgot'} className={'signup'}>Forgot IonID or Password</Link>
                </div>
            </form>
        </div>
    );
}

export default AuthBox;