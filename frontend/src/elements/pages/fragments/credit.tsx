import React from "react";
import {Link} from "react-router-dom";
import {Stack} from "react-bootstrap";

type CreditProps = {
    className?: string
}

function Credit(props: CreditProps) {
    return (
        <Stack className={'small text-muted ' + props.className}>
            <p className='m-0'>Ion by Changwoon Hyun</p>
            <p className='m-0'>Seungwon Lee and Nakyung Lee</p>
            <p className='m-0'>Look up <Link to='https://github.com/miho73/ion'
                                                        target='_blank'>GitHub</Link> repository of project Ion</p>
        </Stack>
    )
}

export default Credit;
