import React from "react";
import {Link} from "react-router-dom";

function CaptchaNotice() {
    return (
        <p className='text-muted ginfo'>
            <span>This site is protected by reCAPTCHA and the Google </span>
            <Link to='https://policies.google.com/privacy' target='_black'>Privacy Policy</Link>
            <span> and </span>
            <Link to='https://policies.google.com/terms' target='_black'>Terms of Service</Link>
            <span> apply.</span>
        </p>
    );
}

export default CaptchaNotice;