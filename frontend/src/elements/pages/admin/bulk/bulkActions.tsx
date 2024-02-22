import React from 'react'
import {Stack} from 'react-bootstrap';
import Promote from './promote';
import SetDefaultState from "./defaultState";

function BulkActions() {
  return (
    <Stack gap={4}>
      <p className='fs-3 fw-bold text-danger m-0'>DANGER ZONE</p>
      <Promote/>
      <SetDefaultState/>
    </Stack>
  );
}

export default BulkActions;
