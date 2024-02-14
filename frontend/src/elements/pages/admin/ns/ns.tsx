import React, {useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import QueryNs from './queryNs';
import AddNs from './addNS';
import AcceptNs from './acceptNs';
import PrintNs from './printNs';
import axios from "axios";

import ChangeNsPreset from "./changeNsPreset";

function NsManage() {
    const [wScode, setWScode] = useState<number>();
    const [timePreset, setTimePreset] = useState(-1);

    useEffect(() => {
        axios.get('/manage/api/ns/mode/get')
            .then(res => {
                setTimePreset(res.data['result']);
            })
            .catch(err => {
                setTimePreset(-1);
            });
    }, []);

    return (
        <Container className="p-3">
            <AcceptNs/>
            <hr/>
            <PrintNs timePreset={timePreset}/>
            <hr/>
            <AddNs timePreset={timePreset} scode={wScode} setScode={setWScode}/>
            <hr/>
            <QueryNs scode={wScode} setScode={(scode: number) => setWScode(scode)}/>
            <hr/>
            <ChangeNsPreset timePreset={timePreset} updatePreset={setTimePreset}/>
        </Container>
    );
}

export default NsManage;