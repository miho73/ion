import React from "react";
import {Link} from "react-router-dom";

type CaptchaNoticeProps = {
    className?: string;
}

function CaptchaNotice(props: CaptchaNoticeProps) {
    return (
        <span className={'small text-muted '+props.className}>
            <span>This site is protected by reCAPTCHA and the Google </span>
            <Link to='https://policies.google.com/privacy' target='_black'>Privacy Policy</Link>
            <span> and </span>
            <Link to='https://policies.google.com/terms' target='_black'>Terms of Service</Link>
            <span> apply.</span>
        </span>
    );
}

export default CaptchaNotice;
