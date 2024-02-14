import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Container,
    Form,
    FormCheck,
    FormGroup,
    FormSelect,
    InputGroup,
    Row,
    Stack,
    Table
} from 'react-bootstrap';
import axios from 'axios';
import {changeBit, getBit} from "../../../service/bitmask";


type RecordRowProps = {
    has: boolean,
    data: any,
    includeDenied: boolean

}

function RecordRow(props: RecordRowProps) {
    function copy(str: string) {
        navigator.clipboard.writeText(str);
    }

    const data = props.data;

    if(!props.has || (!props.includeDenied && !data.a)) {
        return (
            <td></td>
        )
    }

    return (
        <>
            { props.includeDenied &&
                <td className={data.a ? 'table-success' : 'table-danger'}>
                    <a onClick={() => copy(data.c)}>{data.c}</a>
                </td>
            }
            { (!props.includeDenied && data.a) &&
                <td>
                    <a title={'Copy'} className={'ns-lst-cpy'} onClick={() => copy(data.c)}>{data.c}</a>
                </td>
            }
        </>
    )
}

type PrintNsProps = {
    timePreset: number
}

function PrintNs(props: PrintNsProps) {
    const [data, setData] = useState<any[]>([]);
    const [grade, setGrade] = useState<number>(1);
    const [date, setDate] = useState<string>('');
    const [includeDenied, setIncludeDenied] = useState<boolean>(false);
    const [workState, setWorkState] = useState<number>(-1);
    const [filterByClass, setFilterByClass] = useState<number>(15);

    const timePreset = props.timePreset;

    function createTable() {
        axios.get('/manage/api/ns/print', {
            params: {grade: grade}
        })
            .then(res => {
                setData(res.data['result']['ns']);
                setDate(res.data['result']['qtime']);
                setWorkState(0);
            })
            .catch(err => {
                switch (err.response?.data['result']) {
                    case 1:
                        setWorkState(1);
                        break;
                    default:
                        setWorkState(2);
                }
            });
    }

    let rr: any[] = [];
    if (workState === 0) {
        data.forEach(e => {
            let clas = (e.code-e.code%100)/100-10*(grade);
            if(getBit(filterByClass, clas-1) === 0) return;
            rr.push(
                <tr>
                    <td>{e.code}</td>
                    <td>{e.name}</td>
                    {timePreset === 0 &&
                        <>
                            <RecordRow has={e.hasOwnProperty("0")} data={e['0']} includeDenied={includeDenied}/>
                            <RecordRow has={e.hasOwnProperty("1")} data={e['1']} includeDenied={includeDenied}/>
                            <RecordRow has={e.hasOwnProperty("2")} data={e['2']} includeDenied={includeDenied}/>
                        </>
                    }
                    {timePreset === 1 &&
                        <>
                            <RecordRow has={e.hasOwnProperty("3")} data={e['3']} includeDenied={includeDenied}/>
                            <RecordRow has={e.hasOwnProperty("4")} data={e['4']} includeDenied={includeDenied}/>
                            <RecordRow has={e.hasOwnProperty("5")} data={e['5']} includeDenied={includeDenied}/>
                            <RecordRow has={e.hasOwnProperty("6")} data={e['6']} includeDenied={includeDenied}/>
                        </>
                    }
                </tr>
            );
        });
    }

    useEffect(() => {
        let c = localStorage.getItem('nlfc');
        if(c === null) {
            localStorage.setItem('nlfc', '15');
            setFilterByClass(15);
        } else {
            setFilterByClass(Number.parseInt(c));
        }

        let g = localStorage.getItem('nlg');
        if(g === null) {
            localStorage.setItem('nlg', '1');
            setGrade(1);
        }
        else {
            setGrade(Number.parseInt(g));
        }
    }, []);
    function updateFilterByClass(clas: number) {
        let c = 0;
        c = changeBit(filterByClass, clas);
        setFilterByClass(c);
        localStorage.setItem('nlfc', c.toString());
    }
    function updateGrade(grade: number) {
        setGrade(grade);
        localStorage.setItem("nlg", grade.toString());
    }

    return (
        <Row className='my-3'>
            <h2>면학 불참 목록</h2>
            <FormGroup>
                <InputGroup className='w-25 mgw'>
                    <FormSelect value={grade} onChange={e => updateGrade(Number.parseInt(e.target.value))}>
                        <option value={1}>1학년</option>
                        <option value={2}>2학년</option>
                        <option value={3}>3학년</option>
                    </FormSelect>
                    <Button onClick={createTable}>로드</Button>
                </InputGroup>
                <Form.Check
                    label='승인되지 않은 요청 포함'
                    className='mt-1'
                    id='drq'
                    checked={includeDenied}
                    onChange={e => setIncludeDenied(e.target.checked)}
                />
                <Stack direction={'horizontal'} gap={3}>
                    <FormCheck
                        label={'1반'}
                        id={'clas-1'}
                        checked={getBit(filterByClass, 0) === 1}
                        onChange={() => updateFilterByClass(0)}
                    />
                    <FormCheck
                        label={'2반'}
                        id={'clas-2'}
                        checked={getBit(filterByClass, 1) === 1}
                        onChange={() => updateFilterByClass(1)}
                    />
                    <FormCheck
                        label={'3반'}
                        id={'clas-3'}
                        checked={getBit(filterByClass, 2) === 1}
                        onChange={() => updateFilterByClass(2)}
                    />
                    <FormCheck
                        label={'4반'}
                        id={'clas-4'}
                        checked={getBit(filterByClass, 3) === 1}
                        onChange={() => updateFilterByClass(3)}
                    />
                </Stack>
            </FormGroup>
            <Container className='my-3'>
                {workState === 0 &&
                    <div className='table-cover'>
                        <Table id='prt'>
                            <thead>
                            <tr>
                                <th>학번</th>
                                <th>이름</th>
                                { timePreset === 0 &&
                                    <>
                                        <th>8면학</th>
                                        <th>1면학</th>
                                        <th>2면학</th>
                                    </>
                                }
                                { timePreset === 1 &&
                                    <>
                                        <th>오후 1차</th>
                                        <th>오후 2치</th>
                                        <th>야간 1차</th>
                                        <th>야간 2차</th>
                                    </>
                                }
                            </tr>
                            </thead>
                            <tbody>{rr}</tbody>
                        </Table>
                        <p>{date}</p>
                    </div>
                }
                {workState === 1 &&
                    <Alert variant='danger'>권한이 부족합니다.</Alert>
                }
                {workState === 2 &&
                    <Alert variant='danger'>문제가 발생했습니다.</Alert>
                }
                {workState === 3 &&
                    <Alert variant='danger'>PDF를 만들지 못했습니다.</Alert>
                }
            </Container>
        </Row>
    );
}

export default PrintNs;
