import {Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";

function GeneralSettings() {
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        axios.get('/user/api/profile/query')
            .then(res => {

            })
            .catch(err => {

            });
    }, []);

    return (
        <Row className={'m-3'}>
            <h4>정보</h4>
            <Table>
                <tbody>
                    <tr>
                        <td>이름</td>
                        <td>홍길동</td>
                    </tr>
                    <tr>
                        <td>학번</td>
                        <td>2020-12345</td>
                    </tr>
                    <tr>
                        <td>아이디</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>최종 로그인</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>가입일</td>
                        <td>12</td>
                    </tr>
                    <tr>
                        <td>상태</td>
                        <td>APRV</td>
                    </tr>
                    <tr>
                        <td>권한</td>
                        <td>1101</td>
                    </tr>
                </tbody>
            </Table>
        </Row>
    );
}

export default GeneralSettings;