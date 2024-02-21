import React from 'react';
import {Link} from 'react-router-dom';

type ErrorPageProps = {
  exp: string;
}

function ErrorPage(props: ErrorPageProps) {
  return (
    <div className={'text-center'}>
      <Link to='/'>
        <img src="/static/image/logo.png" width="50%" alt='홈으로'/>
      </Link>
      <h1 className="mt-4">문제가 생겼어요.</h1>
      <p className='fs-4'>{props.exp}</p>
    </div>
  )
}

export default ErrorPage;
