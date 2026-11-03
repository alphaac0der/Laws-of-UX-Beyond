import { useState } from 'preact/hooks';
import { GHOST, Intro, PRIMARY, wait } from './shared';

const DURATION = 5000;
// A: quick start, painful crawl at the end. B: slow start, fast finish. Same total time.
const CURVES = { a: 'cubic-bezier(0.1, 0.9, 0.3, 1)', b: 'cubic-bezier(0.8, 0, 0.9, 0.1)' };

export default function PeakEndDemo() {
  const [phase, setPhase] = useState<'intro' | 'a' | 'b' | 'ask' | 'done'>('intro');
  const [running, setRunning] = useState(false);
  const [pick, setPick] = useState<'a' | 'b' | 'same' | null>(null);

  async function play() {
    for (const k of ['a', 'b'] as const) {
      setPhase(k);
      setRunning(false);
      await wait(400);
      setRunning(true);
      await wait(DURATION + 300);
    }
    setPhase('ask');
  }

  if (phase === 'intro')
    return (
      <Intro
        title="Two downloads"
        text="You’ll watch two file downloads, one after the other. Just watch, then tell us which felt faster."
        cta="Start downloads"
        onStart={play}
      />
    );

  if (phase === 'a' || phase === 'b')
    return (
      <div class="demo">
        <div class="demo-center">
          <p class="demo-step">Download {phase.toUpperCase()}</p>
          <p class="demo-title">Downloading report.pdf…</p>
          <div class="progress-big">
            <div
              style={{
                transform: running ? 'scaleX(1)' : 'scaleX(0)',
                transition: running ? `transform ${DURATION}ms ${CURVES[phase]}` : 'none',
              }}
            />
          </div>
        </div>
      </div>
    );

  if (phase === 'ask')
    return (
      <div class="demo">
        <p class="demo-title">Which download felt faster?</p>
        <div class="choice-grid">
          <button class="choice" onClick={() => { setPick('a'); setPhase('done'); }}>Download A</button>
          <button class="choice" onClick={() => { setPick('b'); setPhase('done'); }}>Download B</button>
          <button class="choice subtle" onClick={() => { setPick('same'); setPhase('done'); }}>About the same</button>
        </div>
      </div>
    );

  return (
    <div class="demo">
      <p class="demo-title">Both took exactly 5 seconds</p>
      <div class="verdict">
        {pick === 'b' ? <>You picked B, like most people. </> : <>Most people pick B. </>}
        Download A raced ahead and then <strong>crawled at the end</strong>. Download B started slowly and{' '}
        <strong>finished fast</strong>. Because we judge an experience mostly by its strongest moment and its ending,
        B feels quicker even though both took the same time.
      </div>
      <button class={GHOST} onClick={play}>
        Watch again
      </button>
    </div>
  );
}
