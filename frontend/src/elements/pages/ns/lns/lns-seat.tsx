import React from 'react';
import {Button} from 'react-bootstrap';

type LnsSeatSelectProps = {
    sn: number,
    rev: boolean,
    revName?: string,
    revScd?: number,
    isSelected: boolean,
    common?: boolean,
    onSelected?: () => void

}

/**
 * @param props sn: Seat number(1-6) rev: Reserved(true/false) revName: Name(str) revScd: sCode(int)
 * @returns
 */
function LnsSeatSelect(props: LnsSeatSelectProps) {
    let str = '', tstr = '';
    if (props.isSelected) {
        str = 'bg-secondary border-secondary';
        tstr = 'text-light';
    } else if (props.common) {
        tstr = 'text-primary fw-bold';
    }

    return (
        <>
            {!props.rev &&
                <Button variant='outline-dark' className={'lns-seat ' + str} onClick={props.onSelected}>
                    <span className={'fs-4 p-2 ' + tstr}>{props.sn}</span>
                </Button>
            }
            {props.rev &&
                <div className='btn btn-outline-dark p-0 lns-seat'>
                    <div className='h-100 d-flex flex-column justify-content-center align-content-center'>
                        <span className='sel-seat fw-bold'>{props.revScd}</span>
                        <span className='sel-seat fw-bold'>{props.revName}</span>
                    </div>
                </div>
            }
        </>
    )
}

export default LnsSeatSelect;