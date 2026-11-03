import { useRef, useState } from 'preact/hooks';
import { PRIMARY } from './shared';

const PRESETS = [50, 400, 1000, 2500];

function zone(ms: number) {
  if (ms <= 100) return 'Feels instant. Your brain treats it as cause and effect.';
  if (ms <= 400) return 'Still smooth. You stay in the flow of what you were doing.';
  if (ms <= 1000) return 'Noticeable. You start waiting instead of doing.';
  return 'Too slow. Your attention drifts and you wonder if it worked.';
}

export default function DohertyDemo() {
  const [delay, setDelay] = useState(400);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  function add() {
    if (busy) return;
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      setCount((c) => c + 1);
    }, delay);
  }

  return (
    <div class="demo">
      <p class="demo-title">Feel the delay</p>
      <p class="demo-text">
        Pick a response time, then click the button a few times. Notice the moment it stops feeling “instant.”
      </p>
      <div class="chip-row" role="group" aria-label="Response time presets">
        {PRESETS.map((p) => (
          <button key={p} class="chip-btn" aria-pressed={delay === p} onClick={() => setDelay(p)}>
            {p < 1000 ? `${p} ms` : `${p / 1000} s`}
          </button>
        ))}
      </div>
      <div class="slider">
        <label for="doherty-delay">
          <span>Response time</span>
          <span>{delay} ms</span>
        </label>
        <input
          id="doherty-delay"
          type="range"
          min={0}
          max={3000}
          step={50}
          value={delay}
          onInput={(e) => setDelay(Number((e.target as HTMLInputElement).value))}
        />
      </div>
      <div class="demo-center" style={{ padding: '20px 0 8px' }}>
        <button class={PRIMARY} onClick={add} aria-busy={busy} style={{ minWidth: '180px' }}>
          {busy ? <span class="spinner" aria-label="Loading" /> : 'Add to cart'}
        </button>
        <p class="demo-step" style={{ marginTop: '12px' }}>
          Items in cart: {count}
        </p>
      </div>
      <p class="live" aria-live="polite">
        {zone(delay)}
      </p>
    </div>
  );
}
