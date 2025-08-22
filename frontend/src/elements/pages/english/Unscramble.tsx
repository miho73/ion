import {Form, Stack} from "react-bootstrap";
import {ReactNode, useEffect, useState} from "react";
import "./Unscramble.css";

function Unscramble() {
  let phrases = [
    'imagining other possibilities for action',
    'shed the idealized images of their parents',
    'to better understand the complexities of life',
    'with these more sophisticated powers of reasoning, teenagers find it easier to imagine',
    'it has actual physiological effects that',
    'testified by electrical changes in their skin',
    'the more their listeners conveyed that',
    'the more the listeners were allied with',
    'like taking on some of their energy',
    'hoping to run out the clock and win',
    'the team that is trailing finds itself',
    'is trying to prevent it from scoring',
    'in which the hero must fight his way',
    'bond invariably succeeds in disarming',
    'not by rejecting previous theories outright',
    'so that more conditions can be explained',
    "which is exactly what einstein's special relativity",
    'for which quantum mechanics had to be',
    'generalized theory that works under all conditions',
    'no single design will be best for',
    'a computer that is more portable',
    'all of which achieve the central objective',
    'whoever establishes the priorities attached to',
    'those who set the priorities attached to',
    'aristocratic parents hired freelance philosophers to educate',
    'contracted out their services from one city-state',
    'claimed the ability to teach any subject',
    'truth is only a matter of persuasive argumentation',
    'which involved learning to argue both sides',
    'were as common as takeaways are today',
    'for country folks coming into town',
    'led to believe with everyone enjoying',
    'such as zinc needed for good long-term health',
    'they would eat as much as their bellies',
    'usually rendering it useless to the organism',
    'the tangles in the cable are secondary',
    'but not actually changing the chemical composition',
    'it might no longer fit into places',
    'prevent it from functioning as it'
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
