import {Form, Stack} from "react-bootstrap";
import {ReactNode, useEffect, useState} from "react";
import "./Unscramble.css";

function Unscramble() {
  let phrases = [
    'showing how expensive ill-health is',
    'other risks we face are',
    'relative to the size of its population',
    'at the expense of other uses',
    'Unpaid caring labor is real labor',
    'where we choose to draw the line',
    'Much of the difficulty in identifying',
    'what is deemed appropriate to laugh at',
    'There is a subjectiveness to the acceptability',
    'it can be used to challenge social norms',
    'seem to have selected a set of',
    'the less accurate is our mental representation',
    'Round numbers are such a device',
    'they refer to approximate quantities',
    'an extended region of the number line',
    'Media manipulation of public opinion demonstrates',
    'is exercised through its selection',
    'using emotional rhetoric rather than fact',
    'an unsubstantiated argument without noting',
    'altering the actual choices available to',
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
