import axios from 'axios';
import React, {useEffect, useState} from 'react'
import ErrorPage from './error';

type MealProps = {
  time: string,
  calo: string,
  meal: string

}

function Meal(props: MealProps) {
  let time: string = props.time;
  let cal: string = props.calo.toLocaleLowerCase();
  let meal: string[] = props.meal.split('<br/>');

  let ma: any[] = [];
  meal.forEach(e => {
    ma.push(
      <p className='m-1'>{e}</p>
    )
  });

  return (
    <div className='w-100'>
      <h3>{time}</h3>
      <div className='border p-3 rounded d-flex flex-column justify-between'>{ma}</div>
      <p className='muted m-0'>{cal}</p>
    </div>
  );
}

function MealNoti() {
  const [data, setData] = useState<any[]>([]);
  const [workState, setWorkState] = useState(-1);

  useEffect(() => {
    axios.get('/etc/api/meal')
      .then(res => {
        const content = res.data['result'];
        if (content.ok) {
          setData(content.data);
          setWorkState(0);
        } else {
          setWorkState(1);
        }
      })
      .catch(err => {
        console.error(err);
        setWorkState(1);
      })
  }, []);

  let elements: any[] = [];
  data.forEach(e => {
    elements.push(
      <Meal time={e.time} calo={e.calo} meal={e.meal}/>
    );
  });

  return (
    <>
      {workState === 0 &&
        <div className='text-center meal d-flex justify-between gap-4'>{elements}</div>
      }
      {
        workState === 1 &&
        <ErrorPage exp='급식 정보가 없습니다.'/>
      }
    </>
  )
}

export default MealNoti;
