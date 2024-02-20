import React, {useEffect, useState} from "react";
import axios from "axios";
import ErrorPage from "../etc/error";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";

type LnsStatusFrameProps = {
    cnt: number,
    nth: string
}

function LnsStatusFrame(props: LnsStatusFrameProps) {
    return (
        <div className={'border-0 p-2 rounded-4 d-flex justify-content-center align-items-center flex-column gap-0'}>
            <div className={'d-flex justify-content-center align-items-end gap-2'}>
                <p className={'display-4 mr-2 number'}>{props.cnt}</p>
                <p className={'number mb-2'}>/ 36</p>
            </div>
            <p className={'my-2'}>{props.nth} 예약</p>
        </div>
    );
}

function LoggedInIndex() {
    const [workState, setWorkState] = useState(-1);

    const [user, setUser] = useState({name: '', id: '', priv: 0});
    const [picture, setPicture] = useState({
        url: 'https://apod.nasa.gov/apod/image/1708/PerseidsoverPyreneesGraffand1024.jpg',
        type: 'image',
        title: 'Perseids over the Pyrénées',
        exp: `This mountain and night skyscape stretches across the French Pyrenees National Park on August 12, near the peak of the annual Perseid meteor shower. The multi-exposure panoramic view was composed from the Col d'Aubisque, a mountain pass, about an hour before the bright gibbous moon rose. Centered is a misty valley and lights from the region's Gourette ski station toward the south. Taken over the following hour, frames capturing some of the night's long bright perseid meteors were aligned against the backdrop of stars and Milky Way.`,
        cpy: 'Jean-Francois\nGraffand'
    });
    const [apodSet, setApodSet] = useState(false);

    const [lns, setLns] = useState([]);
    const [lnsSet, setLnsSet] = useState(false);
    const [timePreset, setTimePreset] = useState(-1);

    useEffect(() => {
        axios.get('/user/api/idx-iden')
            .then(res => {
                setUser(res.data['result']);
            })
            .catch(() => {
                setWorkState(1);
            });

        axios.get('/idx/apod')
            .then(res => {
                if (res.data['result']['type'] === 'image') {
                    setPicture(res.data['result']);
                }
            })
            .catch(err => {
                console.error(err);
            }).finally(() => {
            setApodSet(true);
        });

        axios.get('/ns/api/lns-idx')
            .then(res => {
                setLns(res.data['result']['seats']);
                setTimePreset(res.data['result']['preset'])
            })
            .catch(err => {
                console.error(err);
            }).finally(() => {
            setLnsSet(true);
        });
    }, []);

    if (workState === 1) {
        return <ErrorPage exp='사용자 정보를 받아오지 못했어요.'/>
    }

    return (
        <div>
            {picture.type === 'image' && apodSet &&
                <div className='w-100 pict' style={{backgroundImage: ('url(' + picture.url + ')')}}></div>
            }
            {!apodSet &&
                <div className='w-100 pict'/>
            }
            <Container className={'index'}>
                {apodSet &&
                    <div className={'text'}>
                        <h1 className={'display-3 text-center'}>{picture.title}</h1>
                        <p className={'fw-light mb-5'}>{picture.exp}</p>
                    </div>
                }
                {!apodSet &&
                    <div className={'text'}>
                        <h1 className={'display-3 text-center'}></h1>
                    </div>
                }
                <div className={'d-flex justify-content-center info'}>
                    {lnsSet &&
                        <>
                            {timePreset === 0 &&
                                <>
                                    <LnsStatusFrame cnt={lns[0]} nth={'8면'}/>
                                    <LnsStatusFrame cnt={lns[1]} nth={'1면'}/>
                                    <LnsStatusFrame cnt={lns[2]} nth={'2면'}/>
                                </>
                            }
                            {timePreset === 1 &&
                                <>
                                    <LnsStatusFrame cnt={lns[0]} nth={'오후 1차'}/>
                                    <LnsStatusFrame cnt={lns[1]} nth={'오후 2차'}/>
                                    <LnsStatusFrame cnt={lns[2]} nth={'야간 1차'}/>
                                    <LnsStatusFrame cnt={lns[3]} nth={'야간 2차'}/>
                                </>
                            }
                        </>
                    }
                    <div className={'border-0 px-2 py-2 rounded-4 d-flex flex-column justify-content-center gap-0 profile-href'}>
                        <Link className={'px-5 py-3 text-center'} to={'/ns'}>면불</Link>
                        <hr/>
                        { user.priv > 1 &&
                            <>
                                <Link className={'px-4 py-3 text-center'} to={'/manage'}>관리</Link>
                                <hr/>
                            </>
                        }
                        <Link className={'px-4 py-3 text-center'} to={'/auth/signout'}>로그아웃</Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default LoggedInIndex;
