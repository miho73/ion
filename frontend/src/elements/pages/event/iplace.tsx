import '../../../css/evt.iplace.scss';
import {useEffect, useRef, useState} from "react";

interface IndexProps {
  setPage: (page: number) => void;
}

function IIndex(props: IndexProps) {
  const [time, setTime] = useState<number>(2);

  useEffect(() => {
    setTime((1732978800 - Math.floor(Date.now()/1000)));

    const timer = setInterval(() => {
      setTime(time => time - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  let t = time
  let si = t % 60; t-= si; t /= 60;
  let mi = t % 60; t-= mi; t /= 60;
  let hi = t % 24; t-= hi; t /= 24;
  let di = t;

  let s = si < 10 ? '0' + si : si;
  let m = mi < 10 ? '0' + mi : mi;
  let h = hi < 10 ? '0' + hi : hi;
  let d = di < 10 ? '0' + di : di;

  return (
    <div className={'index'}>
      <h1>i/place</h1>
      { time < 0 && <button onClick={() => props.setPage(1)}>GO!</button> }
      {time >= 0 && <p>T - {d}:{h}:{m}:{s}</p> }
      <hr/>
      <ul>
        <li>i/place는 2024년 12월 1일부터 31일까지 31일간 진행됩니다.</li>
        <li>1920 x 1080 크기의 공유 캔버스에서 진행되고, 각 참가자는 10초에 한 번씩 픽셀을 찍을 수 있습니다.</li>
      </ul>
    </div>
  )
}

function Evt() {
  const [colors, setColors] = useState<string[]>([]);
  const [offset, setOffset] = useState<number[]>([0, 0]);
  const [lastPosition, setLastPosition] = useState<number[]>([0, 0]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const colors = [];
    for (let i = 0; i < 1920 * 1080; i++) {
      colors.push(`rgb(${Math.floor(i * 255 / (1920*1080))}, ${255}, ${255})`);
    }
    setColors(colors);

    function beginDrag(e: MouseEvent) {
      setIsDragging(true);
      setLastPosition([e.clientX, e.clientY]);
    }

    function moveDrag(e: MouseEvent) {
      if(!isDragging || !lastPosition) return;

      const deltaX = e.clientX - lastPosition[0];
      const deltaY = e.clientY - lastPosition[1];

      setLastPosition([e.clientX, e.clientY]);
      setOffset([offset[0] + deltaX, offset[1] + deltaY]);
    }

    function endDrag() {
      setIsDragging(false);
    }

    document.addEventListener('mousedown', beginDrag);
    document.addEventListener('pointerdown', beginDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('pointermove', moveDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag);
  }, [isDragging, lastPosition, offset]);


  const width = 1920;
  const height = 1080;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let colorIndex = 0;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(x + offset[0], y + offset[0], 1, 1);
        colorIndex++;
      }
    }
  }, [colors, width, height, offset]);

  return (
    <div className={'evt'}>
      <canvas
        ref={canvasRef}
        style={{border: '1px solid black'}}
      />
    </div>
  )
}

function Iplace() {
  const [window, setWindow] = useState<number>(0);

  return (
    <div className={'iplace'}>
    {window === 1 && <IIndex setPage={setWindow}/>}
      {window === 0 && <Evt/>}
    </div>
  )
}

export default Iplace;
