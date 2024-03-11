import axios from 'axios';

/**
 * check user login status
 * @returns 0: logged in. 1: not logged in. 2: error
 */

function isLogin(setLogin: (a: number) => void) {
  axios.get("/auth/api/authorize")
    .then((res: any) => {
      if (res.data['result']) {
        setLogin(0);
      } else setLogin(1);
    })
    .catch((err: any) => {
      console.error(err);
      setLogin(2);
    });
}


/*
function isLogin(setLogin: (a: number) => void) {
    setLogin(0);
    return
  axios.get("/auth/api/authorize")
    .then((res: any) => {
      if (res.data['result']) {
        setLogin(0);
      } else setLogin(1);
    })
    .catch((err: any) => {
      console.error(err);
      setLogin(2);
    });
}*/

function checkPrivilege(setLogin: (a: number) => void) {
  axios.get("/auth/api/authorize-e", {
    params: {"priv": 3}
  })
    .then((res: any) => {
      if (res.data['result']) {
        setLogin(0);
      } else setLogin(1);
    })
    .catch((err: any) => {
      console.error(err);
      setLogin(2);
    });
}

export {isLogin, checkPrivilege};
