import { useRef, useState } from 'preact/hooks';

const PRIMARY = 'demo-btn';
const GHOST = 'demo-btn ghost';

const FOODS = [
  'Pizza', 'Sushi', 'Tacos', 'Ramen', 'Burger', 'Salad', 'Pasta', 'Curry', 'Pho', 'Falafel',
  'Dumplings', 'Burrito', 'Kebab', 'Paella', 'Risotto', 'Lasagna', 'Nachos', 'Gyoza', 'Bagel',
  'Waffles', 'Pancakes', 'Omelette', 'Biryani', 'Shawarma', 'Noodles', 'Steak', 'Hot dog', 'Croissant',
];
const ROUNDS = [4, 24];
const TRIALS = 3;

type Phase = 'intro' | 'prompt' | 'grid' | 'done';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length);
const secs = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

export default function HicksDemo() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0);
  const [trial, setTrial] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const [times, setTimes] = useState<number[][]>([[], []]);
  const [wrong, setWrong] = useState<string | null>(null);
  const start = useRef(0);

  function setupTrial(r: number) {
    const opts = shuffle(FOODS).slice(0, ROUNDS[r]);
    setOptions(opts);
    setTarget(opts[Math.floor(Math.random() * opts.length)]);
    setPhase('prompt');
  }

  function begin() {
    setTimes([[], []]);
    setRound(0);
    setTrial(0);
    setupTrial(0);
  }

  function showGrid() {
    setPhase('grid');
    start.current = performance.now();
  }

  function pick(item: string) {
    if (item !== target) {
      setWrong(item);
      setTimeout(() => setWrong(null), 300);
      return;
    }
    const t = performance.now() - start.current;
    const next = times.map((a, i) => (i === round ? [...a, t] : a));
    setTimes(next);
    if (trial + 1 < TRIALS) {
      setTrial(trial + 1);
      setupTrial(round);
    } else if (round + 1 < ROUNDS.length) {
      setRound(round + 1);
      setTrial(0);
      setupTrial(round + 1);
    } else {
      setPhase('done');
    }
  }

  const step = `Round ${round + 1}/${ROUNDS.length} · Pick ${trial + 1}/${TRIALS}`;

  if (phase === 'intro') {
    return (
      <div class="demo">
        <div class="demo-center">
          <p class="demo-title">The menu test</p>
          <p class="demo-text">
            We’ll name a dish. Find it on the menu and click it as fast as you can. First with 4 options, then with
            24. We’ll time you.
          </p>
          <button class={PRIMARY} onClick={begin}>Start the test</button>
        </div>
      </div>
    );
  }

  if (phase === 'prompt') {
    return (
      <div class="demo">
        <div class="demo-top">
          <span class="demo-step">{step}</span>
          <span class="demo-step">{ROUNDS[round]} options</span>
        </div>
        <div class="demo-center">
          <div class="demo-prompt">
            Find
            <strong>{target}</strong>
          </div>
          <button class={PRIMARY} onClick={showGrid} autoFocus>
            Show me the menu
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'grid') {
    return (
      <div class="demo">
        <div class="demo-top">
          <span class="demo-step">{step}</span>
          <span class="demo-step">{ROUNDS[round]} options</span>
        </div>
        <div class="find-bar">
          Find <b>{target}</b>
        </div>
        <div class={`menu-grid ${options.length <= 4 ? 'few' : ''}`}>
          {options.map((o) => (
            <button key={o} class={`menu-item ${wrong === o ? 'wrong' : ''}`} onClick={() => pick(o)}>
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const [few, many] = times.map(avg);
  const max = Math.max(few, many);
  const ratio = many / few;
  return (
    <div class="demo">
      <p class="demo-title">Your results</p>
      <div class="results">
        <div class="bar-row">
          <span>4 options</span>
          <div class="bar-track">
            <div class="bar-fill muted" style={{ width: `${(few / max) * 100}%` }} />
          </div>
          <span class="bar-val">{secs(few)}</span>
        </div>
        <div class="bar-row">
          <span>24 options</span>
          <div class="bar-track">
            <div class="bar-fill" style={{ width: `${(many / max) * 100}%` }} />
          </div>
          <span class="bar-val">{secs(many)}</span>
        </div>
      </div>
      <div class="verdict">
        {ratio > 1.15 ? (
          <>
            You were <strong>{ratio.toFixed(1)}× slower</strong> with 24 options, even though the task was exactly the
            same. That extra time is Hick’s Law at work.
          </>
        ) : (
          <>
            Nice, you were fast either way! Most people are <strong>1.5–2× slower</strong> with 24 options. The effect
            grows when options are harder to compare, like plans, settings or products.
          </>
        )}
      </div>
      <button class={GHOST} onClick={begin}>Try again</button>
    </div>
  );
}
