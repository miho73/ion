import React, {useEffect, useState} from 'react';
import {isLogin} from '../../service/auth';
import AuthError from '../auth/AuthError';
import LoginPage from '../auth/login/login';
import LoggedInIndex from "./LoggedInIndex";

function Index() {
    const [loginState, setLoginState] = useState(-1);

    useEffect(() => {
        isLogin(setLoginState);
    }, []);

    if (loginState === -1) {
        return <></>;
    } else if (loginState === 0) {
        return <LoggedInIndex/>;
    } else if (loginState === 1) {
        return <LoginPage/>;
    } else {
        return <AuthError/>;
    }
}

export default Index;
