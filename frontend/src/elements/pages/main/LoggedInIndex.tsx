import React, {useEffect, useState} from "react";
import axios from "axios";
import ErrorPage from "../etc/error";
import {Stack} from "react-bootstrap";
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
  const [workState, setWorkState] = useState<number>(-1);

  const [user, setUser] = useState<{
    name: string,
    id: string,
    priv: number
  }>({name: '', id: '', priv: 0});

  const [picture, setPicture] = useState<
    {
      url: string,
      type: string,
      title: string,
      exp: string,
      cpy: string
    }
  >({
    url: 'https://apod.nasa.gov/apod/image/2104/AS17-152-23420_Ord.jpg',
    type: 'image',
    title: 'Apollo 17: The Crescent Earth',
    exp: `Our fair planet sports a curved, sunlit crescent against the black backdrop of space in this stunning photograph. From the unfamiliar perspective, the Earth is small and, like a telescopic image of a distant planet, the entire horizon is completely within the field of view. Enjoyed by crews on board the International Space Station, only much closer views of the planet are possible from low Earth orbit. Orbiting the planet once every 90 minutes, a spectacle of clouds, oceans, and continents scrolls beneath them with the partial arc of the planet's edge in the distance. But this digitally restored image presents a view so far only achieved by 24 humans, Apollo astronauts who traveled to the Moon and back again between 1968 and 1972. The original photograph, AS17-152-23420, was taken by the homeward bound crew of Apollo 17, on December 17, 1972. For now it's the last picture of Earth from this planetary perspective taken by human hands.   - NASA Remembers Michael Collins -`,
    cpy: ''
  });
  const [apodSet, setApodSet] = useState<boolean>(false);

  const [lns, setLns] = useState<number[]>([]);
  const [lnsSet, setLnsSet] = useState<boolean>(false);
  const [timePreset, setTimePreset] = useState<number>(-1);

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
    <>
      <div className={'text-white mt-4 overflow-y-auto index'}>
        {apodSet &&
          <div className={'text-center'}>
            <h1 className={'display-3'}>{picture.title}</h1>
            <p className={'fw-light d-none d-md-block'}>{picture.exp}</p>
          </div>
        }
        {!apodSet &&
          <div className={'text-center'}>
            <h1 className={'display-3 text-center'}></h1>
            <p className={'fw-light d-none d-md-block'}></p>
          </div>
        }

        <Stack className={'index-ui'} gap={0}>
          {lnsSet &&
            <Stack direction={'horizontal'} gap={0}
                   className={'justify-content-center my-1 my-sm-5 gap-sm-5 reservation-status'}>
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
            </Stack>
          }

          <Stack direction={'horizontal'} className={'justify-content-center gateway'}>
            <Link className={'py-3 px-sm-5 py-sm-4 text-center text-decoration-none text-white fw-light fs-5'}
                  to={'/ns'}>면불</Link>
            {user.priv > 1 &&
              <Link className={'py-3 px-sm-5 py-sm-4 text-center text-decoration-none text-white fw-light fs-5'}
                    to={'/manage'}>관리</Link>
            }
            <Link className={'py-3 px-sm-5 py-sm-4 text-center text-decoration-none text-white fw-light fs-5'}
                  to={'/auth/signout'}>로그아웃</Link>
          </Stack>
        </Stack>
      </div>

      {picture.type === 'image' && apodSet &&
        <div className='vh-100 vw-100 position-absolute start-0 top-0 z-n1'
             style={{backgroundImage: ('url(' + picture.url + ')'), backgroundSize: 'cover'}}></div>
      }
      {!apodSet &&
        <div className='vh-100 vw-100 position-absolute start-0 top-0 z-n1'/>
      }
    </>
  );
}

export default LoggedInIndex;
