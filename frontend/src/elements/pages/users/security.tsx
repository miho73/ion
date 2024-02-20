import {Row} from "react-bootstrap";
import React, {useState} from "react";

import {ReactComponent as FidoIcon} from '../../../assets/icons/FIDO_Passkey_mark_A_white.svg';
import {startRegistration} from "@simplewebauthn/browser";
import axios from "axios";

function SecuritySettings() {
    const [workState, setWorkState] = useState<number>(0);

    function registerPasskey() {
        axios.get('/auth/api/passkey/registration/options/get')
            .then(res => {
                startRegistration(res.data.result.publicKey).then(attestation => {
                    axios.post("/auth/api/passkey/registration/complete", {
                        attestation: attestation
                    }).then(res => {
                        let code = res.data.result;
                        if (code === 0) setWorkState(-1);
                        else setWorkState(3);
                    }).catch(() => {
                        setWorkState(2);
                    });
                });
            })
            .catch(() => {
                setWorkState(1);
            });
    }

    return (
        <Row className={'m-3'}>
            <div>
                <h2>Passkey</h2>
                <hr/>
                <button className='btn btn-lg btn-secondary fs-6 w-fit' type='button' onClick={registerPasskey}>
                    <FidoIcon className={'icon'}/>
                    <span>Passkey 설정</span>
                </button>
                {workState === -1 && <div className='alert alert-success mt-3 w-fit'>Passkey를 등록했습니다.</div>}
                {workState === 1 && <div className='alert alert-danger mt-3 w-fit'>인증 정보를 받아오지 못했습니다.</div>}
                {workState === 2 && <div className='alert alert-danger mt-3 w-fit'>Passkey를 검증할 수 없습니다.</div>}
                {workState === 3 && <div className='alert alert-danger mt-3 w-fit'>생성된 Passkey를 검증하지 못했습니다.</div>}
            </div>
        </Row>
    )
}

export default SecuritySettings;
