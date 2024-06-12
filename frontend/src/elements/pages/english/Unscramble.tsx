import {Form, Stack} from "react-bootstrap";
import {ReactNode, useEffect, useState} from "react";
import "./Unscramble.css";

function Unscramble() {
  let phrases = [
    'everything I can see from up here is something',
    'they go about their work, sharing the labor fairly',
    'peace does not last forever, even among ants',
    'neighbors fight over the borders to their territory',
    'orbital observations that have enabled the understanding',
    'which have helped to feed millions more than',
    'The identification of mineral resources is increasingly performed',
    'much of what drives modern civilization is affected',
    'created a very personal way to commemorate their participation in',
    'celebrated the end of significant professional projects',
    'allowing him to spend time away as chief engineer',
    'the charms hanging from the delicate gold links tell',
    'the letters are displayed far apart on the screen',
    'no matter how rapidly in succession they are spoken',
    'when the rapidly but separately pronounced phonemes are followed by',
    'it encourages the fiction that words consist of separate segments',
    'how successful the person will be in attaining career outcomes',
    'consider a person who had created an organization',
    'what if that person\'s true passion was for art',
    'This situation would be an example of an inauthentic career',
    'While media are a significant cause of change in the social order, rarely are they the only one, or largest one.',
    'Thus, while the emergence of television likely contributed to changing notions of childhood, several other sociocultural factors may have strengthened this process.',
    'One particularly relevant factor has been a shifting balance of power in the family.',
    'Unlike the traditional "top-down" family communication style of the 1950s, today\'s parents negotiate with their children about what they may and must do, and both parties have a say in the outcome.',
    'Parents feel it is important to involve their children in family decisions so that they can learn to make choices and develop their identities.',
    'The parental motto has changed from "behave yourself" to "be yourself."',
    'Parents are more indulgent, feel guilty more often, and want the best for their children.',
    'They want to be "cool" parents, more their children\'s friends than authority figures.',
    'The demands of the self usually conform so closely to societal norms that we feel no tension in acting upon our desires.',
    'The self emerges most clearly at times when our passions clash with social protocol.',
    'Their very inconvenience makes them feel "true."',
    'Over the last 150 years, however, psychologists and neuroscientists have warned us against attributing too much authenticity to our thoughts.',
    'Our brains are always engaged in rationalization: framing raw demands from our subconscious as well-grounded, logical requests.',
    'Psychologist Bruce Hood elaborates, "Even if you deliberate over an idea, turning it over in your conscious mind, you are simply delaying the final decision that has, to all intents and purposes, already been made."',
    'Later, "having been presented with a decision, we then make sense of it as if it were our own."',
    'The overwhelming number of truth-hiding mechanisms in our brains has convinced Hood that the self is an "illusion."',
    'Whether or not this is the best framing, we should certainly abandon the idea that the self is a "real me" cordoned off from any social influence.',
    'In the 1990s, as the Internet saw its global adoption, it became clear that not everything connected to the Internet should be available to everyone.',
    'An organization\'s server could include internal information that it never intended to be available from the outside, yet often it was easy to find for anyone who cared to look for it.',
    'Another challenge was that the technology was built with the idea that we trust people to use it appropriately.',
    'The implied idea that no one will intentionally try to sabotage or break things was a remnant of the early Internet days, and one that meant many servers and systems were open for anyone to use.',
    'We just trusted people not to take advantage.',
    'One of the first demonstrations of the lack of IT security was the first recorded Internet worm in 1988.',
    'The Morris worm provided clear evidence that the technology was not at all secure just because we tend to trust the users on the system.',
    'The notion that "development" is synonymous with "economic growth" has been subjected to severe criticism.',
    'By far the most significant is that of Amartya Sen, who has argued that "commodities" — the production of which is a major part of economic growth — are only of value to us in terms of what they allow us actually to do.',
    'Sen advocates that we should think about development rather in terms of people\'s capability to achieve those things that they have reason to value: "The focus here is on the freedom that a person actually has to do this or be that — things that he or she may value doing or being."',
    'It is inherent in this approach that freedoms, both the "negative" freedoms - being free from unjustified coercion, and freedoms of speech and expression, of association, and of movement — and the "positive" freedoms, which have to do with what makes it possible for people actually to enjoy their freedom (including the material [commodity] means for this), are of fundamental importance.',
    'According to this view, therefore, development "can be seen as a process of expanding the real freedoms that people enjoy."'
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
