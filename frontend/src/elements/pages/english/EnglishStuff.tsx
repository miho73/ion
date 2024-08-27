import {Tab, Tabs} from "react-bootstrap";
import NsManage from "../admin/ns/ns";
import React from "react";
import WordTest from "./WordTest";
import Unscramble from "./Unscramble";

function EnglishStuff() {
  return (
    <>
      <Tabs defaultActiveKey='word' className={'my-2'}>
        <Tab eventKey='word' title='단어 암기'>
          <WordTest/>
        </Tab>
        <Tab eventKey='scramble' title='문장 배열'>
          <Unscramble/>
        </Tab>
      </Tabs>
    </>
  );
}

export default EnglishStuff;
