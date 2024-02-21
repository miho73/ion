import React from 'react';
import {Button, Stack} from 'react-bootstrap';

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
        <Button variant={'outline-dark'} className={'lns-seat px-0 py-0'} disabled={true}>
          <Stack>
            <span className={'reservee'}>{props.revScd}</span>
            <span className={'reservee'}>{props.revName}</span>
          </Stack>
        </Button>
      }
    </>
  )
}

export default LnsSeatSelect;
