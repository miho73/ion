import React, {useState} from 'react';
import LnsSeat from './lns-seat';
import {changeBit, getBit} from '../../../service/bitmask';
import {Button, Form, Stack} from 'react-bootstrap';

const sigMapping = ['A', 'B', 'C', 'D', 'E', 'F']

type LnsRoomSelectProps = {
    lnsState: number,
    seatLst: any[],
    nst: number,
    selected: number,
    setSelected: (key: number) => void,
    timePreset: number,
    reloadFunc: () => void
}

function LnsRoomSelect(props: LnsRoomSelectProps) {
    const [findCommon, setFindCommon] = useState<number>(0);

    function changeFCF(place: number) {
        setFindCommon(changeBit(findCommon, place));
    }

    if (props.lnsState === 2) {
        return (
            <Stack>
                <p className='mb-2'>노트북 면불실 자리를 확인하지 못했습니다.</p>
                <Button variant='outline-primary' className='w-fit' onClick={props.reloadFunc}>다시 시도</Button>
            </Stack>
        );
    } else if (props.lnsState === 0) {
        return <p>잠시만요</p>;
    }

    const pLst = props.seatLst;
    const selected = pLst[props.nst];
    const timePreset = props.timePreset;

    if (selected === undefined) {
        return (
            <Stack>
                <p className='mb-2'>해당 시간에는 노트북실 자리 예약이 불가능합니다.</p>
            </Stack>
        )
    }

    let commonOk: string[] = [];
    // find common pre-process
    if (findCommon !== 0 && timePreset === 0) {
        let n0 = getBit(findCommon, 0), n1 = getBit(findCommon, 1), n2 = getBit(findCommon, 2);

        for (let a = 0; a < 6; a++) {
            for (let s = 1; s <= 6; s++) {
                let code = sigMapping[a] + s;
                let ok =
                    (!(n0 && pLst[0].hasOwnProperty(code))) &&
                    (!(n1 && pLst[1].hasOwnProperty(code))) &&
                    (!(n2 && pLst[2].hasOwnProperty(code)));

                if (ok) commonOk.push(code);
            }
        }
    } else if (findCommon !== 0 && timePreset === 1) {
        let n3 = getBit(findCommon, 3), n4 = getBit(findCommon, 4), n5 = getBit(findCommon, 5),
            n6 = getBit(findCommon, 6);

        for (let a = 0; a < 6; a++) {
            for (let s = 1; s <= 6; s++) {
                let code = sigMapping[a] + s;
                let ok =
                    (!(n3 && pLst[3].hasOwnProperty(code))) &&
                    (!(n4 && pLst[4].hasOwnProperty(code))) &&
                    (!(n5 && pLst[5].hasOwnProperty(code))) &&
                    (!(n6 && pLst[6].hasOwnProperty(code)));

                if (ok) commonOk.push(code);
            }
        }
    }

    let map: any[] = [];
    map.push(
        <p className='w-100 mx-auto my-2 text-center border p-3 rounded' key={0}>면학실</p>
    );
    for (let i = 0; i < 3; i++) { // ROW 1, 2, 3
        for (let j = 1; j <= 2; j++) { // COL 1, 2
            let seat: any[] = [];
            for (let k = 1; k <= 6; k++) { // SEAT 1 ~ 6
                // 32: C의 2번
                let key = i * 20 + j * 10 + k;
                let cp = sigMapping[i * 2 + j - 1] + k;
                if (selected.hasOwnProperty(cp)) {
                    const rev = selected[cp];
                    seat.push(
                        <LnsSeat
                            sn={k}
                            rev={true}
                            revName={rev.name}
                            revScd={rev.scode}
                            key={key}
                            isSelected={false}
                        />
                    )
                } else {
                    seat.push(
                        <LnsSeat
                            sn={k}
                            rev={false}
                            key={key}
                            isSelected={key === props.selected}
                            onSelected={() => props.setSelected(key)}
                            common={commonOk.includes(cp)}
                        />
                    );
                }
            }
            map.push(
                <div className={"elem"}>
                    <div className='btn-group-vertical'>{seat.slice(0, 3)}</div>
                    <div
                        className='p-5 border border-dark rounded fs-4 h-100 d-flex align-items-center'>{sigMapping[i * 2 + j - 1]}</div>
                    <div className='btn-group-vertical'>{seat.slice(3, 6)}</div>
                </div>
            )
        }
    }
    return (
        <div>
            {map}
            <div className='border p-2'>
                <p className='mb-1 fw-bold'>공통자리 찾기</p>
                {timePreset === 0 &&
                    <Stack direction='horizontal' gap={3}>
                        <Form.Check id='csf0' checked={getBit(findCommon, 0) === 1} onChange={() => changeFCF(0)}
                                    label='8면'/>
                        <Form.Check id='csf1' checked={getBit(findCommon, 1) === 1} onChange={() => changeFCF(1)}
                                    label='1면'/>
                        <Form.Check id='csf2' checked={getBit(findCommon, 2) === 1} onChange={() => changeFCF(2)}
                                    label='2면'/>
                    </Stack>
                }
                {timePreset === 1 &&
                    <Stack direction='horizontal' gap={3}>
                        <Form.Check id='csf3' checked={getBit(findCommon, 3) === 1} onChange={() => changeFCF(3)}
                                    label='오후 1차'/>
                        <Form.Check id='csf4' checked={getBit(findCommon, 4) === 1} onChange={() => changeFCF(4)}
                                    label='오후 2차'/>
                        <Form.Check id='csf5' checked={getBit(findCommon, 5) === 1} onChange={() => changeFCF(5)}
                                    label='야간 1차'/>
                        <Form.Check id='csf6' checked={getBit(findCommon, 6) === 1} onChange={() => changeFCF(6)}
                                    label='야간 2차'/>
                    </Stack>
                }
            </div>
        </div>
    )
}

export default LnsRoomSelect;
