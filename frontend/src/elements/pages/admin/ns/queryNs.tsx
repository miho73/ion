import React, {useState} from "react";
import {Alert, Button, Form, InputGroup, Modal, Stack, Table} from "react-bootstrap";
import NsState from "../../ns/nsState";
import axios from "axios";
import {inRange} from "../../../service/checker";
import {changeBit, getBit} from "../../../service/bitmask";


type QueryNsProps = {
  scode: number | undefined,
  setScode: (scode: number) => void

}

function QueryNs(props: QueryNsProps) {
  const [workError, setWorkError] = useState(-1);
  const [nsLst, setNsLst] = useState<any[]>([]);
  const [formState, setFormState] = useState<number>(0);

  const [targetNs, setTargetNs] = useState<[number, string]>();
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState(-1);

  const scode = props.scode;
  const setScode = props.setScode;

  function exe() {
    let state = 0;
    if (!inRange(1101, 3424, scode)) state = changeBit(state, 0);
    setFormState(state);
    if (state !== 0) return;

    axios.get('/manage/api/ns/get-user', {
      params: {code: scode}
    })
      .then(res => {
        setNsLst(res.data['result']['reqs']);
        setWorkError(0);
      })
      .catch(err => {
        const cd = err.response?.data['result'];
        switch (cd) {
          case 1:
            setWorkError(1);
            break;
          case 2:
            setWorkError(2);
            break;
          default:
            setWorkError(3);
            break;
        }
      });
  }

  let rr: any[] = [];
  if (!workError) {
    if (nsLst.length === 0) {
      rr.push(
        <tr>
          <td colSpan={7}>
            <p className='my-2 fw-bold'>면학 불참 신청이 없습니다.</p>
          </td>
        </tr>
      );
    } else {
      nsLst.forEach(req => {
        let row = <NsState
          time={req.time}
          place={req.place}
          superviser={req.supervisor}
          reason={req.reason}
          seat={req.lnsSeat}
          lnsReq={req.lnsReq}
          status={req.status}
          showDeleteConfirm={() => setDeleteModalShow(true)}
          setTargetNs={setTargetNs}
        />
        rr.push(row);
      });
    }
  } else {
    rr.push(
      <tr>
        <td className='table-danger' colSpan={7}>면학 불참 신청 목록을 받지 못했습니다.</td>
      </tr>
    )
  }

  function deleteNs() {
    setDeleting(true);
    if (targetNs === undefined) {
      setDeleteResult(1);
      setDeleting(false);
      return;
    }

    axios.delete('/manage/api/ns/delete', {
      params: {
        code: scode,
        time: targetNs[0]
      }
    })
      .then(res => {
        closeDeleteConfirm();
        exe();
      })
      .catch(() => {
        setDeleteResult(1);
      })
      .finally(() => {
        setDeleting(false);
      });
  }

  function closeDeleteConfirm() {
    setDeleteModalShow(false);
    setDeleteResult(-1);
  }

  return (
    <>
      <Stack gap={1}>
        <h2>면학 불참 확인</h2>
        <Form.Group>
          <InputGroup className={'input-mx-sm'}>
            <InputGroup.Text>학번</InputGroup.Text>
            <Form.Control
              type='number'
              placeholder='학번' aria-label={'학번'}
              value={scode}
              isInvalid={getBit(formState, 0) === 1}
              onChange={e => setScode(Number.parseInt(e.target.value))}
            />
            <Button onClick={exe}>확인</Button>
          </InputGroup>
          {workError === 1 &&
            <Alert variant='danger w-fit'>권한이 부족합니다.</Alert>
          }
          {workError === 2 &&
            <Alert variant='danger w-fit'>해당 IonID가 없습니다.</Alert>
          }
          {workError === 3 &&
            <Alert variant='danger w-fit'>문제가 발생했습니다.</Alert>
          }
          {workError === 0 &&
            <div className='table-cover'>
              <Table className='m-auto'>
                <thead>
                <tr>
                  <th>면학</th>
                  <th>장소</th>
                  <th>담당교사</th>
                  <th>사유</th>
                  <th>노면실 자리</th>
                  <th>상태</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>{rr}</tbody>
              </Table>
            </div>
          }
        </Form.Group>
      </Stack>

      <Modal show={deleteModalShow} onHide={closeDeleteConfirm} dialogClassName='modal-dialog-centered'>
        <Modal.Header closeButton>
          <Modal.Title>면학 불참 신청 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteResult === -1 &&
            <p>{scode}의 {targetNs ? targetNs[1] : 'undefined'}에 신청된 면학 불참 신청을 삭제할까요?</p>
          }
          {deleteResult === 1 &&
            <p className='bg-danger text-white p-3 rounded'>삭제하지 못했습니다.</p>
          }
        </Modal.Body>
        <Modal.Footer>
          {deleteResult === -1 &&
            <>
              <Button onClick={deleteNs} disabled={deleting}>예</Button>
              <Button onClick={closeDeleteConfirm} disabled={deleting}>아니오</Button>
            </>
          }
          {deleteResult === 0 &&
            <>
              <Button onClick={closeDeleteConfirm}>확인</Button>
            </>
          }
          {deleteResult === 1 &&
            <>
              <Button onClick={deleteNs} disabled={deleting}>재시도</Button>
              <Button onClick={closeDeleteConfirm} disabled={deleting}>취소</Button>
            </>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default QueryNs;
