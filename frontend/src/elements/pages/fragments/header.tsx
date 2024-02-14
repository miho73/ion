import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {Button, Col, Image} from "react-bootstrap";

function Header() {
    const [hamburgerOpen, setHamburgerOpen] = React.useState<Boolean>(false);
    const [expandFlag, setExpandFlag] = React.useState<Boolean>(false);

    function ctrLHamburger() {
        if(hamburgerOpen) {
            setExpandFlag(false);
        }
        else {
            setHamburgerOpen(true);
        }
    }

    useEffect(() => {
        if(hamburgerOpen) {
            setTimeout(() => {
                setExpandFlag(true);
            }, 100);
        }
    }, [hamburgerOpen]);

    useEffect(() => {
        if(!expandFlag) {
            setTimeout(() => {
                setHamburgerOpen(false);
            }, 200);
        }
    }, [expandFlag]);

    return (
        <header>
            <nav className="d-flex flex-shrink-0 bg-light nav header">
                <Link to="/">
                    <img src="/static/image/logo.png" alt="home"/>
                </Link>
                <hr/>
                <ul className="nav nav-pills gap-1">
                    <li className="only-desktop">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li>
                        <Link to="/ns" className="nav-link">면불신청</Link>
                    </li>
                    <li>
                        <Link to="/etc/meal" className="nav-link">급식</Link>
                    </li>
                    <li>
                        <Link to="/docs" className="nav-link">문서</Link>
                    </li>
                </ul>
                <Button variant={'outline-light'}
                        className={'btn'}
                        onClick={ctrLHamburger}>
                    <Image src={'/static/image/assets/hamburger.svg'} roundedCircle/>
                </Button>
            </nav>
            <nav id={'sidenav'} className={'sidenav overflow-hidden ' + (hamburgerOpen ? 'open' : 'd-none') + (expandFlag ? ' expand' : '')}>
                <Col className={'d-flex flex-column border border-bottom border-0'}>
                    <Link className={'py-2 px-3 w-100 text-dark text-decoration-none fw-normal fs-6 border border-1 border-start-0 border-end-0'} to={'/'}>Home</Link>
                    <Link className={'py-2 px-3 w-100 text-dark text-decoration-none fw-normal fs-6 border border-1 border-start-0 border-end-0'} to={'/ns'}>면불신청</Link>
                    <Link className={'py-2 px-3 w-100 text-dark text-decoration-none fw-normal fs-6 border border-1 border-start-0 border-end-0'} to={'/etc/meal'}>급식</Link>
                    <Link className={'py-2 px-3 w-100 text-dark text-decoration-none fw-normal fs-6 border border-1 border-start-0 border-end-0'} to={'/docs'}>문서</Link>
                </Col>
            </nav>
        </header>
    );
}

export default Header;