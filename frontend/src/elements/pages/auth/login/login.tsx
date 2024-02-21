import React, {useState} from 'react';
import UpdateScode from './subpages/updateScode';
import CoreLogin from './subpages/authentication/coreLogin';

function LoginPage() {
  const [changeFlag, setChangeFlag] = useState<boolean>(false);

  return (
    <>
      {changeFlag && <UpdateScode/>}
      {!changeFlag && <CoreLogin setChangeFlag={setChangeFlag}/>}
    </>
  )
}

export default LoginPage;
