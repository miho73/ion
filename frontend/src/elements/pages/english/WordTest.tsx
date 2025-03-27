import React, {useState} from 'react';
import {Button, ButtonGroup, Col, Form, Row, Stack, Table} from 'react-bootstrap';

interface Word {
  word: string;
  meanings: string[];
}

const words: { [key: string]: Word[] } = {
  ch13_1: [
    { word: "reasonable", meanings: ["합리적인"] },
    { word: "conclude", meanings: ["결론짓다"] },
    { word: "primitive", meanings: ["원시의", "원시적인"] },
    { word: "assurance", meanings: ["확신"] },
    { word: "state", meanings: ["상태"] },
    { word: "unquestionably", meanings: ["의심할 여지 없이"] },
    { word: "prescientific", meanings: ["(근대) 과학 발생 이전의"] },
    { word: "bear resemblance to", meanings: ["~과 유사성이 있다"] },
    { word: "induction", meanings: ["귀납 추리", "귀납법", "귀납적 결론"] },
    { word: "exhibit", meanings: ["보여 주다"] },
    { word: "in terms of", meanings: ["~의 관점에서", "~의 측면에서"] },
    { word: "occurrence", meanings: ["현상", "사건", "발생"] },
    { word: "by means of", meanings: ["~의 도움으로", "~에 의해서"] },
    { word: "in combination with", meanings: ["~과 결합하여"] },
    { word: "initial", meanings: ["초기의"] },
    { word: "prevail", meanings: ["널리 퍼지다", "우세하다"] },
    { word: "statement", meanings: ["진술", "설명"] }
  ],
  ch13_2: [
    { word: "identity", meanings: ["정체성"] },
    { word: "ollie", meanings: ["알리(보드 뒷부분을 한 발로 세게 눌러서 하는 점프)"] },
    { word: "elementary", meanings: ["기본적인"] },
    { word: "water supply", meanings: ["급수", "상수도"] },
    { word: "autobiography", meanings: ["자서전"] },
    { word: "instructor", meanings: ["강사"] },
    { word: "drill", meanings: ["연습", "훈련"] }
  ],
  ch13_3: [
    { word: "face", meanings: ["직면하다"] },
    { word: "-driven", meanings: ["~ 주도의", "~ 중심의"] },
    { word: "fundamental", meanings: ["근본적인"] },
    { word: "insight", meanings: ["통찰력"] },
    { word: "device", meanings: ["기기", "장치"] },
    { word: "typical", meanings: ["일반적인"] },
    { word: "handheld", meanings: ["휴대용의"] },
    { word: "translate", meanings: ["번역하다"] },
    { word: "proposition", meanings: ["것", "일", "문제"] }
  ],
  ch13_4: [
    { word: "ups and downs", meanings: ["기복", "고저"] },
    { word: "reassuring", meanings: ["걱정을 없애 주는"] },
    { word: "stability", meanings: ["안정감"] },
    { word: "engage in", meanings: ["~을 하다"] },
    { word: "cue", meanings: ["신호"] },
    { word: "facilitate", meanings: ["촉진하다"] },
    { word: "pursuit", meanings: ["추구"] },
    { word: "incorporate", meanings: ["포함하다"] },
    { word: "relieve", meanings: ["완화하다"] },
    { word: "exhaustion", meanings: ["고갈"] },
    { word: "bring on", meanings: ["~을 야기하다"] },
    { word: "afford", meanings: ["제공하다"] },
    { word: "personalize", meanings: ["개인의 필요에 맞추다"] },
    { word: "comic strip", meanings: ["만화"] },
    { word: "mug", meanings: ["머그 컵"] },
    { word: "carve out", meanings: ["~을 개척하다"] }
  ],
  ch14_1: [
    { word: "virtue", meanings: ["미덕", "선"] },
    { word: "building block", meanings: ["구성 요소"] },
    { word: "character", meanings: ["성품", "성격"] },
    { word: "fundamental", meanings: ["근본적인", "기본적인"] },
    { word: "playfulness", meanings: ["장난기"] },
    { word: "possess", meanings: ["소유하다"] },
    { word: "capacity", meanings: ["능력"] },
    { word: "exercise", meanings: ["발휘하다"] },
    { word: "ethics", meanings: ["윤리학"] },
    { word: "excel", meanings: ["탁월하다"] },
    { word: "differentiate", meanings: ["구별하다"] },
    { word: "degree", meanings: ["정도"] },
    { word: "framework", meanings: ["틀"] },
    { word: "chronic", meanings: ["상습적인", "고질적인"] },
    { word: "entirely", meanings: ["완전히"] },
    { word: "genuine", meanings: ["진심 어린", "진정한"] }
  ],
  ch14_2: [
    { word: "willfully", meanings: ["의도적으로"] },
    { word: "ignorant", meanings: ["(어떤 일을) 모르는", "무지한"] },
    { word: "admit", meanings: ["인정하다"] },
    { word: "disinterest", meanings: ["무관심"] },
    { word: "continuous", meanings: ["지속적인"] },
    { word: "literacy", meanings: ["문해력", "읽고 쓰는 능력"] },
    { word: "flourish", meanings: ["활발하다", "번창하다"] }
  ],
  ch14_3: [
    { word: "blame", meanings: ["비난하다"] },
    { word: "after the fact", meanings: ["사후에"] },
    { word: "inexcusable", meanings: ["변명할 수 없는"] },
    { word: "valid", meanings: ["타당한"] },
    { word: "induce", meanings: ["유도하다"] },
    { word: "mapping", meanings: ["배치"] }
  ],
  ch14_4: [
    { word: "distribution", meanings: ["배급", "배포", "유통"] },
    { word: "executive", meanings: ["경영 간부"] },
    { word: "tremendously", meanings: ["엄청나게"] },
    { word: "potential", meanings: ["잠재력"] },
    { word: "just about", meanings: ["거의"] },
    { word: "ensure", meanings: ["보장하다"] },
    { word: "clip", meanings: ["클립(짧은 동영상)"] },
    { word: "viral video", meanings: ["바이럴 비디오(온라인 유명 동영상)"] }
  ],
  ch15_1: [
    { word: "diagnose", meanings: ["진단"] },
    { word: "considerable", meanings: ["상당한"] },
    { word: "identification", meanings: ["발견", "인지"] },
    { word: "absence", meanings: ["부재"] },
    { word: "moral", meanings: ["도덕적인"] },
    { word: "preventive", meanings: ["예방의", "예방용의"] }
  ],
  ch15_2: [
    { word: "naive", meanings: ["순진한"] },
    { word: "optimism", meanings: ["낙관론"] },
    { word: "sustain", meanings: ["지속시키다"] },
    { word: "irrational", meanings: ["비이성적인"] },
    { word: "stock", meanings: ["주식"] },
    { word: "skyrocket", meanings: ["급등하다"] },
    { word: "overinflated", meanings: ["과도하게 부풀려진"] },
    { word: "collapse", meanings: ["붕괴하다"] },
    { word: "assumption", meanings: ["가정"] }
  ],
  ch15_3: [
    { word: "fundamental", meanings: ["근본적인"] },
    { word: "capacity", meanings: ["능력"] },
    { word: "evolve", meanings: ["진화하다", "발전하다"] },
    { word: "physiologist", meanings: ["생리학자"] },
    { word: "do double duty", meanings: ["두 가지 역할을 하다"] },
    { word: "therapist", meanings: ["치료사"] },
    { word: "induce", meanings: ["유도하다"] },
    { word: "release", meanings: ["분비", "방출"] },
    { word: "ease", meanings: ["완화하다"] },
    { word: "sensation", meanings: ["감각"] },
    { word: "cooperation", meanings: ["협력"] },
    { word: "reproductive", meanings: ["번식의", "생식의"] },
    { word: "exceed", meanings: ["초과하다"] },
    { word: "building block", meanings: ["구성 요소"] }
  ],
  ch15_4: [
    { word: "evolutionary", meanings: ["진화(론)적인", "진화의"] },
    { word: "take pleasure in", meanings: ["~을 즐기다"] },
    { word: "overwhelming", meanings: ["압도적인"] },
    { word: "quantitative", meanings: ["양적인"] },
    { word: "generalizable", meanings: ["일반화할 수 있는"] },
    { word: "property", meanings: ["속성"] },
    { word: "underlying", meanings: ["근본적인"] },
    { word: "surroundings", meanings: ["환경"] },
    { word: "formulation", meanings: ["공식화"] },
    { word: "toolkit", meanings: ["도구 세트"] },
    { word: "capture", meanings: ["포착하다"] }
  ],
  ch16_1: [
    { word: "impact", meanings: ["영향"] },
    { word: "frozen", meanings: ["얼어붙은"] },
    { word: "pond", meanings: ["연못"] },
    { word: "rural", meanings: ["시골의"] },
    { word: "inaccessible", meanings: ["접근할 수 없는"] },
    { word: "disadvantaged", meanings: ["(경제적으로) 어려운", "가난한"] },
    { word: "translate into", meanings: ["~을 초래하다", "결과로 ~을 낳다"] }
  ],
  ch16_2: [
    { word: "ageism", meanings: ["노인 차별", "연령 차별"] },
    { word: "reflect", meanings: ["반영하다"] },
    { word: "inequality", meanings: ["불평등"] },
    { word: "bother", meanings: ["괴롭히다"] },
    { word: "dietetic", meanings: ["식이 요법용의", "영양학의"] },
    { word: "be related to", meanings: ["~과 관련이 있다"] },
    { word: "tendency", meanings: ["풍조", "경향", "추세"] },
    { word: "define", meanings: ["정의하다"] },
    { word: "burden", meanings: ["짐", "부담"] },
    { word: "perceptive", meanings: ["통찰력 있는"] },
    { word: "embarrassment", meanings: ["창피함", "당혹감"] },
    { word: "the bottom line", meanings: ["요점", "핵심"] },
    { word: "oriented", meanings: ["지향하는"] },
    { word: "worsen", meanings: ["악화시키다"] },
    { word: "diminish", meanings: ["폄하하다", "깎아내리다"] },
    { word: "be subjected to", meanings: ["~을 겪다", "~을 당하다"] },
    { word: "prejudice", meanings: ["편견"] },
    { word: "discrimination", meanings: ["차별"] },
    { word: "generate", meanings: ["만들어 내다", "생성하다"] },
    { word: "myth", meanings: ["근거 없는 통념"] }
  ],
  ch16_3: [
    { word: "enhance", meanings: ["향상하다"] },
    { word: "thrive", meanings: ["번성하다"] },
    { word: "pass along", meanings: ["~을 전수하다"] },
    { word: "precise", meanings: ["정확한"] },
    { word: "cognitive", meanings: ["인지적인"] },
    { word: "sophisticate", meanings: ["정교한"] },
    { word: "collective", meanings: ["집단적인"] },
    { word: "concept", meanings: ["개념"] },
    { word: "procedure", meanings: ["절차"] },
    { word: "tackle", meanings: ["다루다"] },
    { word: "mental", meanings: ["정신적인"] }
  ],
  ch16_4: [
    { word: "minimum", meanings: ["최소의", "최소한의"] },
    { word: "requirement", meanings: ["요건", "필요조건"] },
    { word: "label", meanings: ["라벨"] },
    { word: "fatten", meanings: ["살찌우다"] },
    { word: "confined", meanings: ["좁고 갇힌"] },
    { word: "designation", meanings: ["명칭", "지정"] },
    { word: "range", meanings: ["목장", "(광대한) 방목지[구역]"] },
    { word: "guarantee", meanings: ["보장하다"] },
    { word: "humane", meanings: ["잔혹하지 않은", "인도적인"] },
    { word: "barn", meanings: ["축사", "외양간"] },
    { word: "conventionally", meanings: ["관행적으로"] },
    { word: "quarters", meanings: ["축사", "숙소"] }
  ],
  ch16_5: [
    { word: "encounter", meanings: ["마주치다"] },
    { word: "given", meanings: ["~을 고려해 보면"] },
    { word: "release", meanings: ["표출"] },
    { word: "underlying", meanings: ["근본적인", "잠재적인"] },
    { word: "mound", meanings: ["(흙)더미"] },
    { word: "founder", meanings: ["건국자", "설립자"] },
    { word: "assemble", meanings: ["소집하다", "집합시키다"] },
    { word: "gigantic", meanings: ["거대한"] },
    { word: "delegate", meanings: ["대표(자)", "사절"] },
    { word: "construction", meanings: ["건설", "건축"] },
    { word: "earthen", meanings: ["흙으로 된"] },
    { word: "disturb", meanings: ["방해하다"] },
    { word: "intense", meanings: ["열성적인", "치열한"] },
    { word: "deliberation", meanings: ["숙의", "토의"] }
  ],
  ch16_6: [
    { word: "relatively", meanings: ["비교적", "상대적으로"] },
    { word: "shallow", meanings: ["피상적인", "얕은"] },
    { word: "valid", meanings: ["유효한", "효력 있는"] },
    { word: "candidate", meanings: ["후보"] },
    { word: "representation", meanings: ["표상"] }
  ]
};

const WordTest: React.FC = () => {
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [isStarted, setIsStarted] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [history, setHistory] = useState<{
    word: string;
    myAnswer: string;
    correctAnswer: string;
    isCorrect: boolean
  }[]>([]);
  const [rate, setRate] = useState(0);

  // 문제 리스트 선택 핸들러
  const handleListSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setSelectedLists(prevSelectedLists => {
      if (prevSelectedLists.includes(value)) {
        return prevSelectedLists.filter(list => list !== value);
      } else {
        return [...prevSelectedLists, value];
      }
    });
  };

  // 문제를 무작위로 선택하여 화면에 표시
  const chooseRandomWord = () => {
    const selectedListKeys = selectedLists.filter(list => list in words);
    if (selectedListKeys.length === 0) {
      alert('문제 리스트를 선택해주세요.');
      return;
    }

    const randomListKey = selectedListKeys[Math.floor(Math.random() * selectedListKeys.length)];
    const randomIndex = Math.floor(Math.random() * words[randomListKey].length);

    setCurrentWord(words[randomListKey][randomIndex]);
    setAnswer('');
    setIsStarted(true);
    setTimeout(() => setAccepting(true), 100);
  };

  setTimeout(() => {
    setRate(checkRate());
  }, 10);

  // 답 입력 시 정답 확인
  const checkAnswer = () => {
    if(!accepting) return;
    if (currentWord) {
      setAccepting(false);
      const userAnswers = answer.trim().toLowerCase().split(',').map(answer => answer.trim());
      const correctAnswers = currentWord.meanings.map(meaning => meaning.trim().toLowerCase());
      const isCorrect = userAnswers.every(userAnswer => correctAnswers.includes(userAnswer));
      setHistory([
        {
          word: currentWord.word,
          myAnswer: answer,
          correctAnswer: currentWord.meanings.join(', '),
          isCorrect,
        },
        ...history,
      ]);
      chooseRandomWord();
    }
  };

  // 엔터키 입력 시 답 확인
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      checkAnswer();
    }
  };

  // 답안 이력 초기화
  const resetHistory = () => {
    setHistory([]);
    setRate(0)
  };

  // 정답률 계산
  const checkRate = () => {
    let correctCount: number = 0;
    let totalCount: number = history.length;
    history.map((item) => {
      if(item.isCorrect) {
        correctCount++;
      }
    });
    if(totalCount == 0) {
      return 0;
    }
    return Math.round((correctCount / totalCount) * 100 * 100) / 100;
  };

  return (
    <>
      <Stack className={'justify-content-center limited-width mx-auto text-center'} gap={3}>
        <div>
          <h1>영단어 시험 프로그램 for Ion</h1>
          <p>Developed by.김채원</p>
        </div>

        <Form className={'text-start'}>
          <Row>
            {Object.keys(words).map((listKey, index) => (
              <Col key={index} xs={6} sm={4} md={3} lg={2} className="mb-2">
                <Form.Check
                  type="checkbox"
                  id={`day-${index}`}
                  label={listKey}
                  value={listKey}
                  checked={selectedLists.includes(listKey)}
                  onChange={handleListSelection}
                />
              </Col>
            ))}
          </Row>
        </Form>
        <p>정답률 : {rate}%</p>
        <ButtonGroup className={'align-self-center'}>
          {!isStarted && (
            <Button onClick={chooseRandomWord}>시작</Button>
          )}
          {isStarted && (
            <Button variant="danger" onClick={resetHistory}>답안 이력 초기화</Button>
          )}
        </ButtonGroup>

        {currentWord && isStarted && (
          <>
            <h3>{currentWord.word}</h3>
            <Form.Control type="text"
                          placeholder="뜻을 입력하세요 (여러 개의 뜻일 경우 쉼표(,)로 구분)"
                          value={answer} onChange={(e) => setAnswer(e.target.value)}
                          onKeyUp={handleKeyUp}
            />
          </>
        )}

        <div>
          <p className="h3">답안 이력</p>
          <div className={'table-cover'}>
            <Table striped bordered hover>
              <thead>
              <tr>
                <th>영단어</th>
                <th>나의 답</th>
                <th>정답</th>
                <th>정답 여부</th>
              </tr>
              </thead>
              <tbody>
              {history.map((item, index) => (
                <tr key={index} className={item.isCorrect ? 'table-success' : 'table-danger'}>
                  <td>{item.word}</td>
                  <td>{item.myAnswer}</td>
                  <td>{item.correctAnswer}</td>
                  <td>{item.isCorrect ? 'O' : 'X'}</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Stack>
    </>
  );
};

export default WordTest;
