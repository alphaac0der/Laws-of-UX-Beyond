import { useState } from 'preact/hooks';
import { GHOST, Intro, PRIMARY } from './shared';

type Kind = 'match' | 'flipped' | 'label';
const ROUNDS: Kind[] = ['match', 'label', 'flipped'];
const NAMES: Record<Kind, string> = { match: 'A normal switch', label: 'A button with a label', flipped: 'A reversed switch' };

function Control({ kind, on, toggle }: { kind: Kind; on: boolean; toggle: () => void }) {
  if (kind === 'label')
    // Ambiguous: the label shows the *current state*, which people often read as the *action*.
    return (
      <button class="mm-label" onClick={toggle}>
        {on ? 'ON' : 'OFF'}
      </button>
    );
  const knobRight = kind === 'match' ? on : !on;
  return (
    <button class={`mm-switch ${knobRight ? 'right' : ''}`} onClick={toggle} aria-label="Light switch">
      <span />
    </button>
  );
}

export default function MentalModelDemo() {
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro');
  const [round, setRound] = useState(0);
  const [on, setOn] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const begin = () => {
    setResults([]);
    setRound(0);
    setOn(false);
    setPhase('play');
  };
  const confirm = () => {
    const r = [...results, on];
    setResults(r);
    if (round + 1 < ROUNDS.length) {
      setRound(round + 1);
      setOn(round + 1 === 1); // the labelled button starts ON, showing "ON"
    } else setPhase('done');
  };

  if (phase === 'intro')
    return (
      <Intro
        title="Turn the light on"
        text="Three different controls. Each time, set it so the light is ON, then press Done. You won’t see the light until the end."
        onStart={begin}
      />
    );

  if (phase === 'play') {
    const kind = ROUNDS[round];
    return (
      <div class="demo">
        <div class="demo-center">
          <p class="demo-step">
            Control {round + 1} of 3 · {NAMES[kind]}
          </p>
          <p class="demo-title" style={{ margin: '8px 0 24px' }}>
            Make the light turn ON
          </p>
          <Control kind={kind} on={on} toggle={() => setOn(!on)} />
          <div style={{ marginTop: '28px' }}>
            <button class={PRIMARY} onClick={confirm}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="demo">
      <p class="demo-title">How did you do?</p>
      <ul class="score-list">
        {ROUNDS.map((k, i) => (
          <li key={k} class={results[i] ? 'ok' : 'no'}>
            <span>
              <span class={`bulb ${results[i] ? 'lit' : ''}`} aria-hidden="true" /> {NAMES[k]}
            </span>
            <b>{results[i] ? 'Light on' : 'Light off'}</b>
          </li>
        ))}
      </ul>
      <div class="verdict">
        The normal switch matched what you expect from every switch you’ve used: knob to the right means on. The
        labelled button was ambiguous: does “OFF” mean <em>it is off</em> or <em>press to turn off</em>? The reversed
        switch broke your expectation completely. When a design doesn’t match people’s <strong>mental model</strong>,
        they make mistakes, even on something this simple.
      </div>
      <button class={GHOST} onClick={begin}>
        Try again
      </button>
    </div>
  );
}
