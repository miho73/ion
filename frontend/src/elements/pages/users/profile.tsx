import {Container, Tab, Tabs} from "react-bootstrap";
import React from "react";
import GeneralSettings from "./generals";
import SecuritySettings from "./security";

function ProfilePage() {
    return (
        <Container className='mt-5 nst'>
            <h1>프로필</h1>
            <Tabs>
                <Tab title={'일반'} eventKey={'generals'}>
                    <GeneralSettings/>
                </Tab>
                <Tab title={'보안'} eventKey={'security'}>
                    <SecuritySettings/>
                </Tab>
            </Tabs>
        </Container>
    );
}

export default ProfilePage;