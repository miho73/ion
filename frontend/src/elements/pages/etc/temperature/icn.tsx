import axios from "axios";
import React, {useEffect, useState} from "react";

function Incheon() {
  const [data, setData] = useState({tem: 0, loc: '', dat: '', tim: ''});
  const [set, setSet] = useState(false);

  const m = data.dat.substring(0, 2);
  const d = data.dat.substring(2, 4);
  const h = data.tim.substring(0, 2);

  useEffect(() => {
    axios.get('/etc/api/temp/incheon')
      .then(res => {
        if (res.data['result']['ok']) {
          setData(res.data['result']);
          setSet(true);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className="cover hangang d-flex align-items-center"
         style={{backgroundImage: 'url("/static/temp/icn.jpg")'}}>
      <div className="m-auto">
        {set &&
          <>
            <p className="tmp mb-0">{data.tem}&deg;C</p>
            <hr className="my-4"/>
            <p className="quote">최고에 도달하려면 최저에서 시작하라. -P.시루스</p>
            <p className="mt-4">{data.loc}에서 {m}월 {d}일 {h}시에 측정된 자료입니다.</p>
          </>
        }
        {!set &&
          <>
            <p className="quote">불러오는중</p>
          </>
        }
      </div>
    </div>
  );
}

export default Incheon;
