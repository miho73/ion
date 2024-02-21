import React from "react";
import {Button} from "react-bootstrap";

type NsStateProps = {
  time: number,
  place: string,
  superviser: string,
  reason: string,
  seat: string,
  status: string,
  lnsReq: boolean,
  setTargetNs: (target: [number, string]) => void,
  showDeleteConfirm: () => void

}

const NsState = function (props: NsStateProps) {
  let cla = '';
  let sHint = '';
  switch (props.status) {
    case 'APPROVED':
      cla = 'table-success text-success text-center';
      sHint = 'APPROVED';
      break;
    case 'DENIED':
      cla = 'table-danger text-danger text-center';
      sHint = 'DENIED';
      break;
    case 'REQUESTED':
      cla = 'text-center'
      sHint = 'REQUESTED';
      break;
    case 'NO_SUPERVISOR':
      cla = 'table-warning text-danger text-center';
      sHint = 'NO SUPERVISOR';
      break;
  }

  let time: string = '';
  switch (props.time) {
    case 0:
      time = '8면'
      break;
    case 1:
      time = '1면'
      break;
    case 2:
      time = '2면'
      break;
    case 3:
      time = '오후 1차'
      break;
    case 4:
      time = '오후 2차'
      break;
    case 5:
      time = '야간 1차'
      break;
    case 6:
      time = '야간 2차'
      break;
    default:
      time = '알 수 없음'
      break;
  }

  function deleteNs() {
    props.setTargetNs([props.time, time]);
    props.showDeleteConfirm();
  }

  return (
    <tr>
      <th>{time}</th>
      <td>{props.place}</td>
      <td>{props.superviser}</td>
      <td>{props.reason}</td>
      {props.lnsReq &&
        <td>{props.seat}</td>
      }
      {!props.lnsReq &&
        <td>-</td>
      }
      <td className={cla}>{sHint}</td>
      <td className="d-flex gap-2">
        <Button variant='outline-secondary' className='d-flex align-content-center p-2' title='삭제'
                onClick={deleteNs}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-x-lg" viewBox="0 0 16 16">
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
          </svg>
        </Button>
      </td>
    </tr>
  )
}

export default NsState;
