import React from 'react';
import Dactivation from './archive/d_activation';
import Deula from './archive/d_eula';
import Dcredit from './archive/d_credit';
import {Container} from 'react-bootstrap';
import {Link, useParams} from 'react-router-dom';
import Dintro from './archive/d_intro';
import Dsystem from "./archive/d_system";

const DOC_REGISTRY: {
    [key: string]: [string, React.JSX.Element]
} = {
    'activation': ['IonID 활성화', (<Dactivation/>)],
    'eula': ["이용약관", (<Deula/>)],
    'introduction': ["Ion 사용하기", (<Dintro/>)],
    'credits': ["Project Ion", <Dcredit/>],
    'system': ["Ion System", <Dsystem/>]
};

function DocsMain() {
    return (
        <Container className='nst'>
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Ion 사용법</h1>
                    <p className="col-md-8 fs-4">Ion의 기능과 이를 활용하는 법을 알아봅니다.</p>
                    <Link className="btn btn-primary btn-lg" to="/docs/introduction">Go</Link>
                </div>
            </div>
            <div className="row align-items-md-stretch">
                <div className="col-md-6 mb-3">
                    <div className="h-100 p-5 text-white bg-dark rounded-3">
                        <h2>Ion 사용자 약관</h2>
                        <p>Ion 사용자 약관을 확인해보세요. 약관은 주기적으로 업데이트되며 Ion을 사용함에 따라 변경되는 약관에 동의하는 것으로 여겨집니다.</p>
                        <Link className="btn btn-outline-light" to="/docs/eula">Ion 사용자 약관</Link>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="h-100 p-5 bg-light border rounded-3">
                        <h2>Ion 개발에 참여하기</h2>
                        <p>Ion은 오픈소스 프로젝트로 누구든지 개발에 참여할 수 있습니다. 개선사항이나 버그, 문제점을 이슈로 제기해주세요. 혹은 직접 개발한 코드를 기여할 수도
                            있습니다.</p>
                        <Link className="btn btn-outline-dark" to='/docs/credits'>Ion Credits</Link>
                    </div>
                </div>
            </div>
        </Container>
    );
}

function NoDocs() {
    return (
        <Container className='nst my-5 text-center'>
            <h1>찾으시는 문서가 없습니다.</h1>
            <Link className='text-decoration-none fs-2' to="/docs">문서 메인</Link>
        </Container>
    );
}

function Docs() {
    let param: string | undefined = useParams()['*'];

    if (param === '') {
        return (
            <DocsMain/>
        );
    }

    let paramUnwarp: string = param as string;

    if (!DOC_REGISTRY.hasOwnProperty(paramUnwarp)) {
        return (
            <NoDocs/>
        )
    }

    return (
        <>
            <Link to='/docs' className='text-decoration-none text-black'>
                <h1>{DOC_REGISTRY[paramUnwarp][0]}</h1>
            </Link>
            <hr/>
            <Container className='nst docs'>
                {DOC_REGISTRY[paramUnwarp][1]}
            </Container>
        </>
    )
}

export default Docs;