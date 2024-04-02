import React, {useState} from 'react';
import {Button, ButtonGroup, Col, Form, Row, Stack, Table} from 'react-bootstrap';

interface Word {
  word: string;
  meanings: string[];
}

const words: { [key: string]: Word[] } = {
  day1: [
    {word: 'psychologist', meanings: ['심리학자']},
    {word: 'conception', meanings: ['개념', '생각']},
    {word: 'estimate', meanings: ['추정하다']},
    {word: 'parallel', meanings: ['평행의']},
    {word: 'justify', meanings: ['옳음을 보여주다']},
    {word: 'preschooler', meanings: ['미취학 아동']},
    {word: 'school-age', meanings: ['학령기의']},
    {word: 'temporal', meanings: ['시간의']},
    {word: 'spatial', meanings: ['공간의']},
    {word: 'dimension', meanings: ['차원']},
    {word: 'duration', meanings: ['지속 기간']},
    {word: 'necessitate', meanings: ['필연적으로 동반하다']},
    {word: 'alternate', meanings: ['교대로 하다']},
    {word: 'identical', meanings: ['동일한']},
    {word: 'translate', meanings: ['번역하다']},
    {word: 'external', meanings: ['외부의', '외면의']},
    {word: 'illustrate', meanings: ['설명하다']},
    {word: 'element', meanings: ['요소']},
    {word: 'reference', meanings: ['언급']},
    {word: 'depict', meanings: ['그리다', '묘사하다']},

  ],
  day2: [
    {word: 'allusion', meanings: ['암시']},
    {word: 'cosmic', meanings: ['우주의']},
    {word: 'emphasize', meanings: ['강조하다']},
    {word: 'resurrection', meanings: ['부활']},
    {word: 'vegetation', meanings: ['식물']},
    {word: 'symbolic', meanings: ['상징적인', '상징하는']},
    {word: 'vivid', meanings: ['선명한', '밝은']},
    {word: 'warrant', meanings: ['정당하게 만들다', '타당하게 만들다']},
    {word: 'selection', meanings: ['선택', '선택된 것들']},
    {word: 'spatial reasoning', meanings: ['공간 추론']},
    {word: 'replicate', meanings: ['복제하다']},
    {word: 'auditory', meanings: ['청각의']},
    {word: 'stimulation', meanings: ['자극']},
    {word: 'alert', meanings: ['기민한']},
    {word: 'spur', meanings: ['자극하다']},
    {word: 'fantastic', meanings: ['환상적인', '상상적인', '근거 없는']},
    {word: 'unethical', meanings: ['비윤리적인']},
    {word: 'bond', meanings: ['유대']},
    {word: 'exaggerate', meanings: ['과장하다']},
    {word: 'genuine', meanings: ['진짜의']},
  ],
  day3: [
    {word: 'discard', meanings: ['버리다']},
    {word: 'distort', meanings: ['비틀다', '왜곡하다']},
    {word: 'correlation', meanings: ['연관성', '상관관계']},
    {word: 'convergence', meanings: ['융화', '수렴']},
    {word: 'physiology', meanings: ['생리학']},
    {word: 'play the devil`s advocate', meanings: ['일부러 반대 의견을 말하다']},
    {word: 'argument', meanings: ['논쟁', '주장']},
    {word: 'challenge', meanings: ['이의를 제기하다']},
    {word: 'pointlessly', meanings: ['무의미하게']},
    {word: 'drift', meanings: ['떠돌다', '표류하다']},
    {word: 'groupthink', meanings: ['집단 사고']},
    {word: 'cohesiveness', meanings: ['응집력', '화합']},
    {word: 'proper', meanings: ['적절한']},
    {word: 'challenge', meanings: ['이의를 제기하다']},
    {word: 'soundness', meanings: ['온당', '건실']},
    {word: 'cooperativeness', meanings: ['협조적임']},
    {word: 'direct', meanings: ['~로 향하다', '감독하다']},
    {word: 'widespread', meanings: ['폭넓은']},
    {word: 'good reason', meanings: ['타당한 이유', '그럴만한 이유']},
    {word: 'adaptation', meanings: ['적응', '각색']},

  ],
  day4: [
    {word: 'incidental', meanings: ['부수적인']},
    {word: 'narrative', meanings: ['이야기']},
    {word: 'spiritual', meanings: ['정신의', '영적인']},
    {word: 'confront', meanings: ['맞서다']},
    {word: 'represent', meanings: ['대표하다', '나타내다', '상징하다']},
    {word: 'aspect', meanings: ['측면']},
    {word: 'civilisation', meanings: ['문명']},
    {word: 'contemporary', meanings: ['동시대의', '그 당시의']},
    {word: 'identify with', meanings: ['~와 동일시하다']},
    {word: 'literal', meanings: ['문자 그대로의', '원문에 충실한']},
    {word: 'depiction', meanings: ['묘사', '서술']},
    {word: 'dramatisation', meanings: ['각색', '극화']},
    {word: 'interpretation', meanings: ['해석', '설명']},
    {word: 'skyscraper', meanings: ['고층 건물', '마천루']},
    {word: 'curse', meanings: ['저주']},
    {word: 'overinvestment', meanings: ['과잉투자']},
    {word: 'speculation', meanings: ['추측', '투기']},
    {word: 'crash', meanings: ['충돌', '추락', '사고', '폭락', '붕괴']},
    {word: 'coincide', meanings: ['동시에 일어나다']},
    {word: 'towering', meanings: ['매우 높은']},

  ],
  day5: [
    {word: 'precursor', meanings: ['선도자', '전조']},
    {word: 'gloom', meanings: ['우울', '어둠']},
    {word: 'downturn', meanings: ['하강', '침체']},
    {word: 'index', meanings: ['색인', '지수']},
    {word: 'recession', meanings: ['경기 후퇴', '불경기']},
    {word: 'average', meanings: ['평균의']},
    {word: 'chemistry', meanings: ['화학', '화학성질']},
    {word: 'transmit', meanings: ['전송하다', '전달하다']},
    {word: 'disturbution', meanings: ['분배']},
    {word: 'nourish', meanings: ['영양분을 공급하다']},
    {word: 'distress call', meanings: ['조난 호출', '구원 요청']},
    {word: 'ecologist', meanings: ['생태학자']},
    {word: 'document', meanings: ['기록하다']},
    {word: 'mite', meanings: ['진드기']},
    {word: 'release', meanings: ['풀어주다', '방출하다']},
    {word: 'prey on', meanings: ['~을 잡아먹다']},
    {word: 'neighboring', meanings: ['근처의']},
    {word: 'nourishment', meanings: ['영양분']},
    {word: 'acutely', meanings: ['강렬히', '예리하게']},
    {word: 'community', meanings: ['공동체', '군락']},

  ],
  day6: [
    {word: 'incur', meanings: ['초래하다', '발생시키다']},
    {word: 'metaphorical', meanings: ['비유적인']},
    {word: 'in terms of', meanings: ['~라는 말로']},
    {word: 'self-perception', meanings: ['자기 인식']},
    {word: 'term', meanings: ['조건']},
    {word: 'infer', meanings: ['추론하다', '암시하다', '보여주다']},
    {word: 'endure', meanings: ['견디다', '감당하다']},
    {word: 'alternative', meanings: ['대안이 되는']},
    {word: 'withdraw', meanings: ['철회하다']},
    {word: 'foster', meanings: ['조장하다']},
    {word: 'charge', meanings: ['비용']},
    {word: 'cherish', meanings: ['소중히 여기다']},
    {word: 'modify', meanings: ['수정하다', '변경하다']},
    {word: 'majority', meanings: ['대다수']},
    {word: 'contemporary', meanings: ['동시대의', '현대의']},
    {word: 'era', meanings: ['시대']},
    {word: 'advent', meanings: ['출현', '도래']},
    {word: 'commission', meanings: ['위임', '의뢰', '주문']},
    {word: 'designated', meanings: ['지정된']},
    {word: 'entail', meanings: ['수반하다']},

  ],
  day7: [
    {word: 'specify', meanings: ['명시하다']},
    {word: 'exacting', meanings: ['까다로운']},
    {word: 'envision', meanings: ['마음에 그리다', '상상하다']},
    {word: 'rigid', meanings: ['단단한', '엄격한']},
    {word: 'constraint', meanings: ['제약']},
    {word: 'be bound to', meanings: ['~할 의무가 있다']},
    {word: 'prearranged', meanings: ['미리 계획된']},
    {word: 'requirement', meanings: ['필요조건']},
    {word: 'made to order', meanings: ['주문 제작된']},
    {word: 'showcase', meanings: ['전시하다']},
    {word: 'venue', meanings: ['장소']},
    {word: 'agriculture', meanings: ['농업']},
    {word: 'technological', meanings: ['과학 기술의']},
    {word: 'commercial', meanings: ['상업의', '이윤을 목적으로 한', '영리적인']},
    {word: 'agriculturalist', meanings: ['농업 전문가']},
    {word: 'vast', meanings: ['광범위한', '막대한']},
    {word: 'at the expense of', meanings: ['~의 비용으로', '~을 희생하여']},
    {word: 'sufficient', meanings: ['충분한']},
    {word: 'capitalist', meanings: ['자본주의적인']},
    {word: 'mode', meanings: ['방식']},

  ],
  day8: [
    {word: 'turn to', meanings: ['~에 의지하다']},
    {word: 'involvement', meanings: ['개입', '관련']},
    {word: 'cash crop', meanings: ['환금 작물']},
    {word: 'competitiveness', meanings: ['경쟁력']},
    {word: 'attempt', meanings: ['시도하다']},
    {word: 'surrounding', meanings: ['환경']},
    {word: 'evolve', meanings: ['발달하다', '진화하다']},
    {word: 'cautious', meanings: ['조심스러운']},
    {word: 'predator', meanings: ['포식자', '약탈자']},
    {word: 'defense mechanism', meanings: ['방어기제']},
    {word: 'overreact', meanings: ['과잉 반응하다']},
    {word: 'irrational', meanings: ['비이성적인']},
    {word: 'abstract', meanings: ['추상적인']},
    {word: 'stimulus', meanings: ['자극제']},
    {word: 'perceive', meanings: ['감지하다', '인식하다']},
    {word: 'distinguish', meanings: ['구별하다']},
    {word: 'obvious', meanings: ['명백한', '분명한']},
    {word: 'application', meanings: ['자원', '적용', '응용']},
    {word: 'innovation', meanings: ['혁신', '획기적인 것']},
    {word: 'synthetic', meanings: ['합성한', '인조의']},

  ],
  day9: [
    {word: 'profitable', meanings: ['수익성이 있는']},
    {word: 'breakthrough', meanings: ['획기적 발전', '돌파구']},
    {word: 'thermometer', meanings: ['온도계']},
    {word: 'accuracy', meanings: ['정확성']},
    {word: 'fluctuation', meanings: ['변화', '변동', '오르내림']},
    {word: 'back up', meanings: ['~을 뒷받침하다']},
    {word: 'conceal', meanings: ['감추다', '숨기다']},
    {word: 'significant', meanings: ['중요한', '의미 있는']},
    {word: 'internal', meanings: ['내부의']},
    {word: 'frustration', meanings: ['좌절감']},
    {word: 'challenge', meanings: ['이의를 제기하다']},
    {word: 'unconventional', meanings: ['인습에 얽매이지 않는']},
    {word: 'thinker', meanings: ['사상가']},
    {word: 'tragedy', meanings: ['비극']},
    {word: 'despair', meanings: ['절망']},
    {word: 'remarkable', meanings: ['놀랄 만한', '놀라운']},
    {word: 'incredible', meanings: ['믿을 수 없는']},
    {word: 'decay', meanings: ['부패하다', '썩다']},
    {word: 'fungus', meanings: ['균류', '곰팡이류']},
    {word: 'nutrient', meanings: ['영양분']},

  ],
  day10: [
    {word: 'functionality', meanings: ['기능성', '기능']},
    {word: 'arithmetic', meanings: ['산수', '계산']},
    {word: 'reason', meanings: ['이유', '판단하다', '추리하다', '추론하다']},
    {word: 'string', meanings: ['일련']},
    {word: 'Arabic numeral', meanings: ['아라비아 숫자']},
    {word: 'cognitive', meanings: ['인지의']},
    {word: 'calculation', meanings: ['계산']},
    {word: 'architecture', meanings: ['건축', '건축학', '구조']},
    {word: 'constraint', meanings: ['제약']},
    {word: 'mobilize', meanings: ['동원하다']},
    {word: 'novel', meanings: ['새로운']},
    {word: 'stabilize', meanings: ['안정시키다']},
    {word: 'confusion', meanings: ['혼란', '혼동']},
    {word: 'as to', meanings: ['~에 관해']},
    {word: 'concentrate on', meanings: ['~에 집중하다']},
    {word: 'undertake', meanings: ['맡다', '착수하다']},
    {word: 'casual', meanings: ['우연의', '격식을 차리지 않는']},
    {word: 'maximize', meanings: ['극대화하다']},
    {word: 'emphasize', meanings: ['강조하다']},
    {word: 'be aware of', meanings: ['~을 알다']},

  ]
  /*추후 day 20까지 늘어날거를 대비해 미리 만들어둠*/
  /*,
  day11: [
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
  ],
  day12: [
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },

  ],
  day13: [
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },

  ],
  day14: [
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },

  ],
  day15: [
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },

  ],
  day16: [
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },

  ],
  day17: [
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },

  ],
  day18: [
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },

  ],
  day19: [
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },
    { word: '', meanings: [''] },

  ],
  day20: [
    { word: 'inclination', meanings: ['경향','성향'] },
    { word: 'profound', meanings: ['엄청난'] },
    { word: 'elaborately', meanings: ['정교하게'] },
    { word: 'device', meanings: ['장치','기구'] },
    { word: 'theoretically', meanings: ['이론상으로'] },
    { word: 'attach', meanings: ['붙이다'] },
    { word: 'quest', meanings: ['탐구','탐색'] },
    { word: 'biblical', meanings: ['성서의','성경의'] },
    { word: 'depict', meanings: ['그리다','묘사하다'] },
    { word: 'mature', meanings: ['어른이 되다','다 자라다'] },
    { word: 'biased', meanings: ['편향된'] },
    { word: 'dispersal', meanings: ['분산','확산'] },
    { word: 'imbalance', meanings: ['불균형'] },
    { word: 'asymmetry', meanings: ['불균형','비대칭'] },
    { word: 'elaborate', meanings: ['정교한'] },
    { word: 'defense mechanism', meanings: ['방어기제'] },
    { word: 'devote ~ to ...', meanings: ['~을 ...에 바치다'] },
    { word: 'lessen', meanings: ['줄다'] },
    { word: 'come down to', meanings: ['~에 귀착하다'] },
    { word: 'competitor', meanings: ['경쟁자'] },
  ]*/
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
      setRate(checkRate());
      setRate(checkRate());
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
