import {Stack} from "react-bootstrap";
import React from "react";

import Passkey from "./passkey";
import Password from "./password";

function SecuritySettings() {
  return (
    <Stack gap={4}>
      <Passkey/>
      <Password/>
    </Stack>
  )
}

export default SecuritySettings;
