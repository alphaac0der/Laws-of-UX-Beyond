import { useRef, useState } from 'preact/hooks';
import { Intro, Results, secs, shuffle } from './shared';

const COLORS = [
  ['Sand', '#d8c3a5'], ['Navy', '#22324f'], ['Forest', '#2f5d46'], ['Rust', '#b4532a'], ['Cream', '#efe6d2'], ['Charcoal', '#3a3a3c'],
  ['Olive', '#6b6b3a'], ['Sky', '#8fb8de'], ['Berry', '#7a2e4d'], ['Mustard', '#d4a62a'], ['Teal', '#2b7a78'], ['Blush', '#e8b4b8'],
  ['Stone', '#a8a39d'], ['Plum', '#5e3a6e'], ['Mint', '#a8d5ba'], ['Coral', '#ee7f6b'], ['Slate', '#5a6b7b'], ['Ivory', '#f6f1e3'],
  ['Moss', '#8a9a5b'], ['Brick', '#9c3d2e'], ['Denim', '#4a6fa5'], ['Sage', '#b2bfa3'], ['Cocoa', '#6f4e37'], ['Lilac', '#c8a2c8'],
  ['Pine', '#1f4d3a'], ['Peach', '#f4b183'], ['Ash', '#8d8d8d'], ['Wine', '#5b1f2a'], ['Lemon', '#f2e68a'], ['Ocean', '#1f5f8b'],
] as const;

type Round = { n: number; time: number; sure: number };

export default function ChoiceOverloadDemo() {
  const [phase, setPhase] = useState<'intro' | 'pick' | 'rate' | 'done'>('intro');
  const [round, setRound] = useState(0);
  const [opts, setOpts] = useState<(typeof COLORS)[number][]>([]);
  const [data, setData] = useState<Round[]>([]);
  const [time, setTime] = useState(0);
  const start = useRef(0);
  const SIZES = [6, 30];

  const show = (r: number) => {
    setRound(r);
    setOpts(shuffle([...COLORS]).slice(0, SIZES[r]));
    setPhase('pick');
    start.current = performance.now();
  };
  const pick = () => {
    setTime(performance.now() - start.current);
    setPhase('rate');
  };
  const rate = (sure: number) => {
    const d = [...data, { n: SIZES[round], time, sure }];
    setData(d);
    if (round === 0) show(1);
    else setPhase('done');
  };

  if (phase === 'intro')
    return (
      <Intro
        title="Pick a sweater"
        text="You’re buying a sweater as a gift. Choose a color you like. You’ll do this twice."
        onStart={() => {
          setData([]);
          show(0);
        }}
      />
    );

  if (phase === 'pick')
    return (
      <div class="demo">
        <p class="demo-step" style={{ marginBottom: '14px' }}>
          Round {round + 1} of 2 · {SIZES[round]} colors · Pick one
        </p>
        <div class={`swatches ${SIZES[round] > 10 ? 'many' : ''}`}>
          {opts.map(([name, hex]) => (
            <button key={name} class="swatch" onClick={pick}>
              <span style={{ background: hex }} />
              {name}
            </button>
          ))}
        </div>
      </div>
    );

  if (phase === 'rate')
    return (
      <div class="demo">
        <div class="demo-center">
          <p class="demo-title">How sure are you about that choice?</p>
          <div class="chip-row" style={{ justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} class="chip-btn big" onClick={() => rate(n)} aria-label={`${n} out of 5`}>
                {n}
              </button>
            ))}
          </div>
          <p class="demo-step">1 = not sure at all · 5 = love it</p>
        </div>
      </div>
    );

  const [a, b] = data;
  return (
    <Results
      bars={[
        { label: '6 colors', value: a.sure, display: `${a.sure}/5` },
        { label: '30 colors', value: b.sure, display: `${b.sure}/5`, highlight: true },
      ]}
      title={`Your confidence (decided in ${secs(a.time)} vs ${secs(b.time)})`}
      verdict={
        b.sure < a.sure ? (
          <>
            More choice made you <strong>less sure</strong>, and you took longer. With 30 options there’s always a
            nagging “maybe another one was better.”
          </>
        ) : (
          <>
            You felt just as sure with 30 colors. In studies, though, people faced with lots of options are{' '}
            <strong>more likely to give up</strong> or feel less happy with what they picked.
          </>
        )
      }
      onRetry={() => {
        setData([]);
        show(0);
      }}
    />
  );
}
