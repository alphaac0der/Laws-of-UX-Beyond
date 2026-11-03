import { useRef, useState } from 'preact/hooks';
import { Intro, Results, secs } from './shared';

const PHONES = [
  { name: 'Nova', price: '$699', battery: '4,500 mAh', camera: '48 MP', storage: '128 GB' },
  { name: 'Orbit', price: '$649', battery: '5,000 mAh', camera: '50 MP', storage: '128 GB' },
  { name: 'Pixelo', price: '$749', battery: '4,800 mAh', camera: '64 MP', storage: '256 GB' },
];
const ROWS = ['price', 'battery', 'camera', 'storage'] as const;
const ANSWER = 'Orbit';

export default function WorkingMemoryDemo() {
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro');
  const [round, setRound] = useState(0);
  const [tab, setTab] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const start = useRef(0);

  const show = (r: number) => {
    setRound(r);
    setTab(0);
    setPhase('play');
    start.current = performance.now();
  };
  const answer = (n: string) => {
    if (n !== ANSWER) {
      setWrong(n);
      setTimeout(() => setWrong(null), 300);
      return;
    }
    const t = [...times, performance.now() - start.current];
    setTimes(t);
    if (round === 0) show(1);
    else setPhase('done');
  };

  if (phase === 'intro')
    return (
      <Intro
        title="Compare three phones"
        text="Find the phone with the biggest battery AND the lowest price. First you’ll see one phone at a time, then a comparison table."
        onStart={() => {
          setTimes([]);
          show(0);
        }}
      />
    );

  if (phase === 'play')
    return (
      <div class="demo">
        <p class="demo-step" style={{ marginBottom: '12px' }}>
          Round {round + 1} of 2 · Biggest battery and lowest price?
        </p>
        {round === 0 ? (
          <div>
            <div class="seg" role="tablist" aria-label="Phones">
              {PHONES.map((p, i) => (
                <button key={p.name} role="tab" aria-selected={tab === i} aria-pressed={tab === i} onClick={() => setTab(i)}>
                  {p.name}
                </button>
              ))}
            </div>
            <dl class="spec">
              {ROWS.map((r) => (
                <div key={r}>
                  <dt>{r}</dt>
                  <dd>{PHONES[tab][r]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <table class="spec-table">
            <thead>
              <tr>
                <th />
                {PHONES.map((p) => (
                  <th key={p.name}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r}>
                  <th>{r}</th>
                  {PHONES.map((p) => (
                    <td key={p.name}>{p[r]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div class="choice-grid" style={{ marginTop: '16px' }}>
          {PHONES.map((p) => (
            <button key={p.name} class={`choice ${wrong === p.name ? 'wrong' : ''}`} onClick={() => answer(p.name)}>
              {p.name}
            </button>
          ))}
        </div>
      </div>
    );

  const [tabs, table] = times;
  return (
    <Results
      bars={[
        { label: 'One at a time', value: tabs, display: secs(tabs), highlight: true },
        { label: 'Side by side', value: table, display: secs(table) },
      ]}
      verdict={
        <>
          With tabs, you had to <strong>hold numbers in your head</strong> while switching between phones. The table
          put everything in view, so your working memory had nothing to juggle. (It was a little easier the second time
          because you already knew the answer, but the table still did the remembering for you.)
        </>
      }
      onRetry={() => {
        setTimes([]);
        show(0);
      }}
    />
  );
}
