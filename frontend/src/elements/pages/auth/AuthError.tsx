import React from "react";
import ErrorPage from "../etc/error";

function AuthError() {
  return <ErrorPage exp='인증서버에 접속하지 못했어요.'/>;
}

export default AuthError;
