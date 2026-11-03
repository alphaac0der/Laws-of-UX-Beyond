import { useState } from 'preact/hooks';
import { GHOST } from './shared';

const QUESTIONS = [
  { q: 'Which yogurt is healthier?', a: '90% fat-free', b: 'Contains 10% fat' },
  { q: 'Which surgery would you choose?', a: '90% of patients survive', b: '10% of patients die' },
  { q: 'Which subscription feels cheaper?', a: 'Just $1 a day', b: '$365 a year' },
];

export default function BiasDemo() {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const done = answers.length === QUESTIONS.length;

  const answer = (v: string) => {
    setAnswers([...answers, v]);
    setI(i + 1);
  };
  const reset = () => {
    setI(0);
    setAnswers([]);
  };

  if (!done) {
    const q = QUESTIONS[i];
    return (
      <div class="demo">
        <p class="demo-step">
          Question {i + 1} of {QUESTIONS.length}
        </p>
        <p class="demo-title" style={{ fontSize: '22px', margin: '8px 0 20px' }}>
          {q.q}
        </p>
        <div class="choice-grid">
          <button class="choice" onClick={() => answer('a')}>
            {q.a}
          </button>
          <button class="choice" onClick={() => answer('b')}>
            {q.b}
          </button>
          <button class="choice subtle" onClick={() => answer('same')}>
            They’re the same
          </button>
        </div>
      </div>
    );
  }

  const fooled = answers.filter((a) => a !== 'same').length;
  return (
    <div class="demo">
      <p class="demo-title">Here’s the twist</p>
      <ul class="score-list">
        {QUESTIONS.map((q, k) => (
          <li key={q.q} class={answers[k] === 'same' ? 'ok' : 'no'}>
            <span>
              “{q.a}” = “{q.b}”
            </span>
            <b>{answers[k] === 'same' ? 'Spotted it' : 'Framing won'}</b>
          </li>
        ))}
      </ul>
      <div class="verdict">
        {fooled === 0 ? (
          <>You saw through all three. Most people don’t.</>
        ) : (
          <>
            Each pair says <strong>exactly the same thing</strong>, but {fooled === 1 ? 'one' : fooled} of them still
            pulled you one way.
          </>
        )}{' '}
        This is the <strong>framing effect</strong>, one of many mental shortcuts that shape decisions without us
        noticing.
      </div>
      <button class={GHOST} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
