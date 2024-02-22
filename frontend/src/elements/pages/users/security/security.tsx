import {Stack} from "react-bootstrap";
import React from "react";

import Passkey from "./passkey";

function SecuritySettings() {
  return (
    <Stack gap={4}>
      <Passkey/>
    </Stack>
  )
}

export default SecuritySettings;
