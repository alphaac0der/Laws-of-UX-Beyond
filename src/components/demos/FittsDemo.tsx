import { useRef, useState } from 'preact/hooks';

const PRIMARY = 'demo-btn';
const GHOST = 'demo-btn ghost';

const ROUNDS = [
  { label: 'Small & far', size: 22, far: true },
  { label: 'Big & close', size: 76, far: false },
];
const HITS = 6; // timed clicks per round (plus one untimed start click)

type Pos = { x: number; y: number };
type Phase = 'intro' | 'play' | 'done';

const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length);

export default function FittsDemo() {
  const arena = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const [times, setTimes] = useState<number[][]>([[], []]);
  const [misses, setMisses] = useState<number[]>([0, 0]);

  function center(): Pos {
    if (!arena.current) return { x: 0, y: 0 };
    const rect = arena.current.getBoundingClientRect();
    const s = 76; // the start button is always 76px
    return { x: (rect.width - s) / 2, y: (rect.height - s) / 2 };
  }

  function place(prev: Pos, r: number): Pos {
    const rect = arena.current!.getBoundingClientRect();
    const { size, far } = ROUNDS[r];
    const W = rect.width - size - 16;
    const H = rect.height - size - 40;
    let best: Pos = { x: 8 + W / 2, y: 32 + H / 2 };
    let bestScore = -Infinity;
    for (let k = 0; k < 60; k++) {
      const p = { x: 8 + Math.random() * W, y: 32 + Math.random() * H };
      const d = Math.hypot(p.x - prev.x, p.y - prev.y);
      // far: maximise distance; close: aim for ~100px away
      const score = far ? d : -Math.abs(d - 100);
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }
    return best;
  }

  function startRound(r: number) {
    setRound(r);
    setHits(0);
    setPhase('play');
    // wait a frame so the arena is mounted and measurable
    requestAnimationFrame(() => setPos(center()));
  }

  function begin() {
    setTimes([[], []]);
    setMisses([0, 0]);
    startRound(0);
  }

  function hit(e: MouseEvent) {
    e.stopPropagation();
    const now = performance.now();
    if (hits > 0) {
      const t = now - last.current;
      setTimes((ts) => ts.map((a, i) => (i === round ? [...a, t] : a)));
    }
    last.current = now;
    const h = hits + 1;
    if (h > HITS) {
      if (round + 1 < ROUNDS.length) startRound(round + 1);
      else setPhase('done');
      return;
    }
    setHits(h);
    setPos(place(pos, round));
  }

  function miss() {
    if (hits > 0) setMisses((m) => m.map((v, i) => (i === round ? v + 1 : v)));
  }

  if (phase === 'intro') {
    return (
      <div class="demo">
        <div class="demo-center">
          <p class="demo-title">The click test</p>
          <p class="demo-text">
            Click the dots as fast as you can. Round 1 gives you small dots far apart. Round 2 gives you big dots
            close together. Watch what happens to your speed.
          </p>
          <button class={PRIMARY} onClick={begin}>Start the test</button>
        </div>
      </div>
    );
  }

  if (phase === 'play') {
    const { size, label } = ROUNDS[round];
    return (
      <div class="demo">
        <div class="arena" ref={arena} onClick={miss}>
          <div class="arena-hud">
            <span>
              Round {round + 1}/2 · {label}
            </span>
            <span>{hits === 0 ? 'click to start' : `${hits}/${HITS}`}</span>
          </div>
          <button
            key={`${round}-${hits}`}
            class={`target ${hits === 0 ? 'start' : ''}`}
            aria-label={hits === 0 ? 'Start round' : `Target ${hits} of ${HITS}`}
            style={{
              width: `${hits === 0 ? 76 : size}px`,
              height: `${hits === 0 ? 76 : size}px`,
              left: `${pos.x}px`,
              top: `${pos.y}px`,
            }}
            onClick={hit}
          >
            {hits === 0 ? 'Start' : ''}
          </button>
        </div>
      </div>
    );
  }

  const [smallFar, bigClose] = times.map(avg);
  const max = Math.max(smallFar, bigClose);
  const ratio = smallFar / bigClose;
  return (
    <div class="demo">
      <p class="demo-title">Your results</p>
      <div class="results">
        <div class="bar-row">
          <span>Small & far</span>
          <div class="bar-track">
            <div class="bar-fill" style={{ width: `${(smallFar / max) * 100}%` }} />
          </div>
          <span class="bar-val">{Math.round(smallFar)}ms</span>
        </div>
        <div class="bar-row">
          <span>Big & close</span>
          <div class="bar-track">
            <div class="bar-fill muted" style={{ width: `${(bigClose / max) * 100}%` }} />
          </div>
          <span class="bar-val">{Math.round(bigClose)}ms</span>
        </div>
      </div>
      <div class="verdict">
        {ratio > 1.15 ? (
          <>
            Each click took you <strong>{ratio.toFixed(1)}× longer</strong> on small, far targets
            {misses[0] > 0 && (
              <>
                , and you missed <strong>{misses[0]}</strong> {misses[0] === 1 ? 'time' : 'times'}
              </>
            )}
            . You used the same mouse and the same hand. Only the size and distance of the target changed.
          </>
        ) : (
          <>
            Impressive aim! Most people are <strong>1.5–2× slower</strong> on small, far targets. The gap gets much
            bigger on a phone, where your thumb covers the target.
          </>
        )}
      </div>
      <button class={GHOST} onClick={begin}>Try again</button>
    </div>
  );
}
