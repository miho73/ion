import {Form, Stack} from "react-bootstrap";
import {ReactNode, useEffect, useState} from "react";

function Unscramble() {
  let phrases = [
    'where nature allowed people to escape their disadvantages',
    'In fact it is the very opposite',
    'that elites regress inexorably to the mean over time',
    'do little to make up for their children\'s genetic mediocrity',
    'in causing us not to think certain things',
    'Once you have locked on to a decision-making problem',
    'in order to get on with making the next incoming decision',
    'Rather than focus only on the biological features of a disease',
    'as well as the behavior of its human patients',
    'should account for the history of infection within a population',
    'ended up with less cash than their victim',
    'whether the thief ended up better off than the victim',
    'harming someone who had unfairly advanced',
    'extends into what humans call the ultrasonic',
    'Such high-frequency sounds travel very poorly in air',
    'For animals that interact on larger scales',
    'reflects the varies ecologies of each species',
    'where few legal restrictions prevail',
    'there is not guarantee tha they will be treated well',
    'that is missing from such debates',
    'call attention to differences in what is right',
    'not if done by someone who lacks',
    'impose the obligation to save a drowning man',
    'The success of science is better accounted for',
    'Earth\'s orbit is elliptical rather than circular',
    'Despite the fact that the theories were false',
    'which he famously did best while working alone',
    'in a manner reminiscent of what goes on',
    'but might also inspire a nuanced appreciation of its rewards'
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
      setQueue(phrases.slice(1, -1));
      phrase = phrases[0];
    }
    else {
      phrase = queue[0];
      setQueue(queue.slice(1, -1));
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

        <Stack direction={'horizontal'} className={'justify-content-center'} gap={3}>{wordScrambled}</Stack>

        <Form.Control
          type={'text'}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={'Type the correct sentence'}
          className={'fs-5 w-75'}
          onKeyDown={nextIteration}
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
