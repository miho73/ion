import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Index from './pages/main';
import ErrorPage from './pages/etc/error';
import Ns from './pages/ns/ns';

import '../css/univ.scss';
import {SignoutPage} from './pages/auth/login/login';
import SignupPage from './pages/auth/signup';
import Docs from './pages/docs/docs';
import Header from './pages/fragments/header';
import ManagementPage from './pages/admin/admin';
import Hangang from './pages/etc/temperature/hangang';
import Incheon from './pages/etc/temperature/icn';
import MealNoti from './pages/etc/meal';
import IForgot from "./pages/auth/iforgot/iforgot";
import ResetPassword from "./pages/auth/iforgot/resetPassword";

import axios from "axios";
import ProfilePage from "./pages/users/profile";

const PREFIX = process.env.REACT_APP_API_PREFIX;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = PREFIX;

function App() {
    return (
        <Router>
            <Header/>
            <div className='px-4 py-3 overflow-x-hidden'>
                <Routes>
                    <Route index path='/' element={<Index/>}/>

                    <Route path='/auth/signup' element={<SignupPage/>}/>
                    <Route path='/auth/signout' element={<SignoutPage/>}/>
                    <Route path='/auth/iforgot' element={<IForgot/>}/>
                    <Route path='/auth/iforgot/reset' element={<ResetPassword/>}/>

                    <Route path='/docs/*' element={<Docs/>}/>

                    <Route path='/ns' element={<Ns/>}/>

                    <Route path='/manage' element={<ManagementPage/>}/>

                    <Route path='/etc/temperature/hangang' element={<Hangang/>}/>
                    <Route path='/etc/temperature/incheon' element={<Incheon/>}/>

                    <Route path='/etc/meal' element={<MealNoti/>}/>

                    <Route path={'/profile'} element={<ProfilePage/>}/>

                    <Route path='*'
                           element={<ErrorPage exp='입력하신 주소가 정확한지 다시 한 번 확인해주세요.'/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
