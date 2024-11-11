import {Form, Stack} from "react-bootstrap";
import {ReactNode, useEffect, useState} from "react";
import "./Unscramble.css";

function Unscramble() {
  let phrases = [
    'is being run on a computer',
    'fast enough for the enjoyment of',
    'not at an adequate pace for',
    'with high graphics settings turned on',
    'enough to simulate those life-like graphics',
    'The result is what gamers call',
    'that is focused on providing material well-being',
    'be judged by considering how well it',
    'depends on much more than how quickly',
    'more than just how much is produced',
    'the extent to which all this activity',
    'the population owns nearly all the material',
    'make sense from an economic perspective',
    'by which the advice is demonstrated',
    'of what is being automated',
    'the process of delivering advice is',
    'that arises from these conflicting views',
    'has been optimised to use data',
    'imagining idealized versions of aspired states',
    'the more desirable the object becomes',
    'a desire to be kept alive',
    'of desire needs to be maintained',
    'the desire to desire can even',
    'the fear of being without desire'
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
