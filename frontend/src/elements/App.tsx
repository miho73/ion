import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Index from './pages/main';
import ErrorPage from './pages/etc/error';
import Ns from './pages/ns/ns';

import '../css/hcsy.scss';
import SignOutPage from "./pages/auth/login/subpages/signout";
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
import {Container} from "react-bootstrap";

const PREFIX = process.env.REACT_APP_API_PREFIX;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = PREFIX;

function App() {
  return (
    <Router>
      <Header/>
      <Container as={'main'} className={'mt-2'}>
        <Routes>
          <Route index path='/' element={<Index/>}/>

          <Route path='/auth/signup' element={<SignupPage/>}/>
          <Route path='/auth/signout' element={<SignOutPage/>}/>
          <Route path='/auth/iforgot' element={<IForgot/>}/>
          <Route path='/auth/iforgot/reset' element={<ResetPassword/>}/>

          <Route path='/docs/*' element={<Docs/>}/>

          <Route path='/ns' element={<Ns/>}/>

          <Route path='/manage' element={<ManagementPage/>}/>

          <Route path='/etc/temperature/hangang' element={<Hangang/>}/>
          <Route path='/etc/temperature/incheon' element={<Incheon/>}/>

          <Route path='/etc/meal' element={<MealNoti/>}/>

          <Route path={'/profile'} element={<ProfilePage/>}/>

          <Route path='*' element={<ErrorPage exp='입력하신 주소가 정확한지 다시 한 번 확인해주세요.'/>}/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
