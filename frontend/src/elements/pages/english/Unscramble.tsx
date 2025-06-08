import {Form, Stack} from "react-bootstrap";
import {ReactNode, useEffect, useState} from "react";
import "./Unscramble.css";

function Unscramble() {
  let phrases = [
    'what others n their community want',
    'someone with whom to live',
    'to want whatever currently signifies',
    'depend on human motivational plasticity',
    'to keep up with their peers',
    'with the intrinsic desire to learn',
    'understanding when ideas from one area',
    'to recognize where their knowledge ends',
    'reveal when collaboration is required',
    'it encourages us to improve ourselves',
    'technology that students are exposed to',
    'how much freedom they should grant',
    'how their children might be exploited',
    'who must be conscious of all',
    'bringing some perspective to these conversations',
    'tend to structure outdoor learning',
    'grouping helps children develop social',
    'mix with children of different age',
    'that learning outdoors simply involves',
    'what education should look like',
    'a vase with a bouquet of flowers',
    'the staff remained polite and welcoming',
    'and put up the orders promptly',
    'were surprised to see such service',
    'no corporate policy required plants',
    'launching a successful attack are low',
    'what keeps the signal honest',
    "why don't babblers emit these calls",
    'made its position known to any predators',
    'only when they have actually spotted'
];

  const [queue, setQueue] = useState<string[]>([]);

  const [answer, setAnswer] = useState<string>('');
  const [dwordList, setDwordList] = useState<string[]>([]);

  const [lastAnswer, setLastAnswer] = useState<string>('');
  const [lastUserInput, setLastUserInput] = useState<string>('');
  const [lastResult, setLastResult] = useState<boolean>(false);

  const [userInput, setUserInput] = useState<string>('');

  function shuffle(array: string[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  function next() {
    let phrase;

    if(queue.length === 0) {
      shuffle(phrases);
      setQueue(phrases.slice(1));
      phrase = phrases[0];
    }
    else {
      phrase = queue[0];
      setQueue(queue.slice(1));
    }

    let dword = phrase.split(' ');
    dword.sort();

    setDwordList(dword);
    setAnswer(phrase);
  }

  let wordScrambled: ReactNode[] = [];
  let userUsed = userInput.toLowerCase().split(' ');
  dwordList.forEach((dword) => {
    let used = userUsed.includes(dword.toLowerCase());
    if(used) {
      userUsed.splice(userUsed.indexOf(dword.toLowerCase()), 1);
    }
    wordScrambled.push(
      <span className={'fs-2' + (used ? ' text-success' : '')}>
        {used ? <s>{dword}</s> : dword}
      </span>
    )
  });

  function nextIteration(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.key !== 'Enter') {
      return;
    }
    e.preventDefault();

    if(answer.toLowerCase() === userInput.toLowerCase()) {
      setLastResult(true);
    }
    else {
      setLastResult(false);
    }

    setLastAnswer(answer);
    setLastUserInput(userInput);
    setUserInput('');
    next();
  }

  useEffect(() => {
    next();
  }, []);

  return (
    <Stack className={'align-items-center'} gap={3}>
      <h1>Unscramble</h1>

      <div className={"wordContainer"}>
        {
          wordScrambled.map((word) => {
            return (<p className={"word"}>{word}</p>)
          })
        }

      </div>

        <Form.Control
          type={'text'}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={'Type the correct sentence'}
          className={'fs-5 w-75'}
          onKeyUp={nextIteration}
        />

        <Stack className={'align-items-center fs-5'} gap={1}>
          <p className={'fw-bold fs-4'}>Last result</p>
          <p>{lastAnswer}</p>
          <p className={(lastResult ? 'text-success' : 'text-danger')}>{lastUserInput}</p>
        </Stack>
    </Stack>
  );
}

export default Unscramble;
