import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {Container, Nav, Navbar} from "react-bootstrap";

function Header() {
  return (
    <header className={'bg-white'}>
      <Navbar expand={'md'}>
        <Container fluid={true} className={'px-0'}>
          <Navbar.Brand as={Link} to={'/'} className={'z-1 mx-2'}>
            <img src="/static/image/logo.png"
                 alt="home"
                 height={40}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={'navbar-links'} className={'z-1 mx-2'}/>
          <Navbar.Collapse id={'navbar-links'} className={'justify-content-end z-1 vw-100 rounded-bottom-4 bg-white'}>
            <Nav className={'gap-2 mx-4 my-2'}>
              <Nav.Link as={Link} to={'/'}>Home</Nav.Link>
              <Nav.Link as={Link} to={'/ns'}>면불신청</Nav.Link>
              <Nav.Link as={Link} to={'/etc/meal'}>급식</Nav.Link>
              <Nav.Link as={Link} to={'/english'}>영어</Nav.Link>
              <Nav.Link as={Link} to={'/profile'}>프로필</Nav.Link>
              <Nav.Link as={Link} to={'/docs'}>문서</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
