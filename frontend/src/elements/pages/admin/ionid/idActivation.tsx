import axios from "axios";
import React, {useState} from "react";
import {Alert, Button, Form, InputGroup} from "react-bootstrap";

function IonIdActivation() {
    const [id, setId] = useState('');
    const [result, setResult] = useState<any[]>([]);

    function setActiveState(mode: number) {
        axios.patch('/manage/api/ionid/active/patch', {
            id: id,
            ac: mode
        })
            .then(res => {
                const r = res.data['result'];
                setResult([
                    0,
                    `"${r['sub']}"의 활성화 상태를 "${r['act']}"로 변경했습니다.`
                ]);
            })
            .catch(err => {
                let msg;
                switch (err.response?.data['result']) {
                    case 1:
                        msg = '권한이 부족합니다.'
                        break;
                    case 4:
                        msg = '해당 IonID가 없습니다.'
                        break;
                    case 5:
                        msg = '자신은 상태는 수정할 수 없습니다.'
                        break;
                    default:
                        msg = '문제가 발생했습니다.'
                        break;
                }
                setResult([1, msg])
            });
    }

    return (
        <div className="w-50 mgw">
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="IonID"
                    value={id}
                    onChange={e => setId(e.target.value)}
                />
                <Button variant="warning" onClick={() => setActiveState(0)}>Inactivate</Button>
                <Button variant="success" onClick={() => setActiveState(1)}>Activate</Button>
                <Button variant="danger" onClick={() => setActiveState(2)}>Ban</Button>
            </InputGroup>
            {result[0] === 0 &&
                <Alert variant="success">{result[1]}</Alert>
            }
            {result[0] === 1 &&
                <Alert variant="danger">{result[1]}</Alert>
            }
        </div>
    );
}

export default IonIdActivation;