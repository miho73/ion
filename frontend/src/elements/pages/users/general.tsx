import {Stack, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";

type userType = {
  id: number,
  name: string,
  grade: number,
  clas: number,
  scode: number,
  joinDate: string,
  lastLogin: string
}

function GeneralSettings() {
  const [userInfo, setUserInfo] = useState<userType | undefined>();
  const [loadUserInfoState, setLoadUserInfoState] = useState<number>(0);

  useEffect(() => {
    axios.get('/user/api/profile/get')
      .then(res => {
        setUserInfo(res.data.result);
      })
      .catch(err => {
        switch (err.response?.data['result']) {
          case 1:
            setLoadUserInfoState(1);
            break;
          case 2:
            setLoadUserInfoState(2);
            break;
          default:
            setLoadUserInfoState(3);
            break;
        }
      });
  }, []);

  return (
    <Stack>
      <h2>정보</h2>
      <Table>
        <tbody>
        <tr>
          <td>이름</td>
          <td>{userInfo?.name}</td>
        </tr>
        <tr>
          <td>학번</td>
          <td>{userInfo?.grade}{userInfo?.clas}{userInfo?.scode}</td>
        </tr>
        <tr>
          <td>아이디</td>
          <td>{userInfo?.id}</td>
        </tr>
        <tr>
          <td>최종 로그인</td>
          <td>{userInfo?.lastLogin} KST</td>
        </tr>
        <tr>
          <td>가입일</td>
          <td>{userInfo?.joinDate} KST</td>
        </tr>
        </tbody>
      </Table>
      {loadUserInfoState === 1 && <p>로그인이 필요합니다.</p>}
      {loadUserInfoState === 2 && <p>사용자를 찾을 수 없습니다.</p>}
      {loadUserInfoState === 3 && <p>프로필을 확인할 수 없습니다.</p>}
    </Stack>
  );
}

export default GeneralSettings;
