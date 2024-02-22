import React, {useEffect, useState} from 'react';
import {Stack} from "react-bootstrap";
import QueryNs from './queryNs';
import AddNs from './addNS';
import AcceptNs from './acceptNs';
import PrintNs from './printNs';
import axios from "axios";

import ChangeNsPreset from "./changeNsPreset";

function NsManage() {
  const [wScode, setWScode] = useState<number>();
  const [timePreset, setTimePreset] = useState<number>(-1);

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
    <Stack gap={4}>
      <AcceptNs/>
      <PrintNs timePreset={timePreset}/>
      <AddNs timePreset={timePreset} scode={wScode} setScode={setWScode}/>
      <QueryNs scode={wScode} setScode={(scode: number) => setWScode(scode)}/>
      <ChangeNsPreset timePreset={timePreset} updatePreset={setTimePreset}/>
    </Stack>
  );
}

export default NsManage;
