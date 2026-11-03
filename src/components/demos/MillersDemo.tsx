import { useState } from 'preact/hooks';
import { GHOST, Intro, PRIMARY } from './shared';

const LENGTHS = [4, 6, 8, 10];
const LETTERS = 'BCDFGHJKLMNPQRSTVWXZ';

function makeSeq(n: number) {
  let s = '';
  while (s.length < n) {
    const c = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    if (!s.endsWith(c)) s += c;
  }
  return s;
}

type Phase = 'intro' | 'show' | 'recall' | 'done';

export default function MillersDemo() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [i, setI] = useState(0);
  const [seq, setSeq] = useState('');
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState<boolean[]>([]);

  function show(idx: number) {
    const s = makeSeq(LENGTHS[idx]);
    setSeq(s);
    setI(idx);
    setAnswer('');
    setPhase('show');
    setTimeout(() => setPhase('recall'), 700 * LENGTHS[idx]);
  }
  function submit(e: Event) {
    e.preventDefault();
    const r = [...results, answer.trim().toUpperCase() === seq];
    setResults(r);
    if (i + 1 < LENGTHS.length) show(i + 1);
    else setPhase('done');
  }
  const start = () => {
    setResults([]);
    show(0);
  };

  if (phase === 'intro')
    return (
      <Intro
        title="How much can you hold?"
        text="We’ll flash a row of letters. When they disappear, type them back in order. Each round gets longer."
        onStart={start}
      />
    );

  if (phase === 'show')
    return (
      <div class="demo">
        <div class="demo-center">
          <p class="demo-step">
            Round {i + 1} of {LENGTHS.length} · {seq.length} letters
          </p>
          <p class="big-seq" aria-live="polite">
            {seq.split('').join(' ')}
          </p>
        </div>
      </div>
    );

  if (phase === 'recall')
    return (
      <div class="demo">
        <form class="demo-center" onSubmit={submit}>
          <p class="demo-step">
            Round {i + 1} of {LENGTHS.length} · Type the {seq.length} letters
          </p>
          <input
            class="demo-input mono"
            value={answer}
            onInput={(e) => setAnswer((e.target as HTMLInputElement).value)}
            autoFocus
            autoComplete="off"
            spellcheck={false}
            aria-label="Letters you remember"
          />
          <div style={{ marginTop: '16px' }}>
            <button class={PRIMARY} type="submit">
              Check
            </button>
          </div>
        </form>
      </div>
    );

  const best = LENGTHS.filter((_, k) => results[k]).pop() ?? 0;
  return (
    <div class="demo">
      <p class="demo-title">Your results</p>
      <ul class="score-list">
        {LENGTHS.map((n, k) => (
          <li key={n} class={results[k] ? 'ok' : 'no'}>
            <span>{n} letters</span>
            <b>{results[k] ? 'Remembered' : 'Missed'}</b>
          </li>
        ))}
      </ul>
      <div class="verdict">
        {best >= 8 ? (
          <>
            Impressive, you held <strong>{best} letters</strong>. You were probably grouping them or saying them in
            a rhythm, which is a trick called chunking.
          </>
        ) : (
          <>
            You held up to <strong>{best || 'fewer than 4'} letters</strong>. Most people top out somewhere between
            5 and 9. That’s why interfaces shouldn’t make people remember long lists.
          </>
        )}
      </div>
      <button class={GHOST} onClick={start}>
        Try again
      </button>
    </div>
  );
}
