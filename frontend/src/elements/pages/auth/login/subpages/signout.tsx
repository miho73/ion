import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Alert} from "react-bootstrap";

function SignOutPage() {
  const navigate = useNavigate();

  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    axios.get('/auth/api/signout')
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        setError(true);
      });
  }, [])

  if (error) {
    return (
      <Alert variant={'danger'}>로그아웃하지 못했습니다.</Alert>
    )
  } else {
    return (
      <p>로그아웃중</p>
    );
  }
}

export default SignOutPage;
