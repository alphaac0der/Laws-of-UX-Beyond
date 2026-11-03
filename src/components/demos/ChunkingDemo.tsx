import { useState } from 'preact/hooks';
import { Intro, PRIMARY, Results } from './shared';

const digits = () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
const chunk = (s: string) => `${s.slice(0, 3)} ${s.slice(3, 6)} ${s.slice(6)}`;
const score = (a: string, b: string) => b.split('').filter((d, i) => a.replace(/\D/g, '')[i] === d).length;

export default function ChunkingDemo() {
  const [phase, setPhase] = useState<'intro' | 'show' | 'recall' | 'done'>('intro');
  const [round, setRound] = useState(0);
  const [num, setNum] = useState('');
  const [answer, setAnswer] = useState('');
  const [scores, setScores] = useState<number[]>([]);

  const show = (r: number) => {
    setRound(r);
    setNum(digits());
    setAnswer('');
    setPhase('show');
    setTimeout(() => setPhase('recall'), 3500);
  };
  const submit = (e: Event) => {
    e.preventDefault();
    const s = [...scores, score(answer, num)];
    setScores(s);
    if (round === 0) show(1);
    else setPhase('done');
  };

  if (phase === 'intro')
    return (
      <Intro
        title="Remember a phone number"
        text="We’ll flash a 10-digit number for a few seconds, twice. Type back as much as you can remember."
        onStart={() => {
          setScores([]);
          show(0);
        }}
      />
    );

  if (phase === 'show')
    return (
      <div class="demo">
        <div class="demo-center">
          <p class="demo-step">Round {round + 1} of 2 · Memorize this</p>
          <p class="big-seq">{round === 0 ? num : chunk(num)}</p>
        </div>
      </div>
    );

  if (phase === 'recall')
    return (
      <div class="demo">
        <form class="demo-center" onSubmit={submit}>
          <p class="demo-step">Round {round + 1} of 2 · Type the number</p>
          <input
            class="demo-input mono"
            inputMode="numeric"
            value={answer}
            onInput={(e) => setAnswer((e.target as HTMLInputElement).value)}
            autoFocus
            autoComplete="off"
            aria-label="The number you remember"
          />
          <div style={{ marginTop: '16px' }}>
            <button class={PRIMARY} type="submit">
              Check
            </button>
          </div>
        </form>
      </div>
    );

  const [raw, grouped] = scores;
  return (
    <Results
      bars={[
        { label: 'One long string', value: raw, display: `${raw}/10` },
        { label: 'In 3 chunks', value: grouped, display: `${grouped}/10`, highlight: true },
      ]}
      title="Digits you got right"
      verdict={
        grouped > raw ? (
          <>
            Same amount of information, but you got <strong>{grouped - raw} more digits</strong> when it was split into
            3 chunks. You only had to remember 3 things instead of 10.
          </>
        ) : (
          <>
            Most people do clearly better with the chunked number. Three small groups are easier to hold than ten
            separate digits, which is why phone numbers and card numbers are written in groups.
          </>
        )
      }
      onRetry={() => {
        setScores([]);
        show(0);
      }}
    />
  );
}
