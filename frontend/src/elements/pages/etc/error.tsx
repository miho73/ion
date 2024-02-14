import React from 'react';
import {Link} from 'react-router-dom';

type ErrorPageProps = {
    exp: string;
}

function ErrorPage(props: ErrorPageProps) {
    return (
        <>
            <main className="container p-4 d-flex justify-content-center align-items-center flex-column text-center h-100 w-100">
                <Link to='/'><img src="/static/image/logo.png" width="60%" className="my-3" alt='홈으로'/></Link>
                <hr/>
                <h1 className="mt-4">문제가 생겼어요.</h1>
                <p className='fs-4'>{props.exp}</p>
            </main>
        </>
    )
}

export default ErrorPage;