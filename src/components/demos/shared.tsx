import type { ComponentChildren } from 'preact';
export const PRIMARY = 'demo-btn';
export const GHOST = 'demo-btn ghost';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length);
export const secs = (ms: number) => `${(ms / 1000).toFixed(2)}s`;
export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Centered start screen used by every demo. */
export function Intro(props: { title: string; text: ComponentChildren; cta?: string; onStart: () => void }) {
  return (
    <div class="demo">
      <div class="demo-center">
        <p class="demo-title">{props.title}</p>
        <p class="demo-text">{props.text}</p>
        <button class={PRIMARY} onClick={props.onStart}>
          {props.cta ?? 'Start'}
        </button>
      </div>
    </div>
  );
}

export type Bar = { label: string; value: number; display: string; highlight?: boolean };

/** Horizontal comparison bars + verdict + retry. */
export function Results(props: { bars: Bar[]; verdict: ComponentChildren; onRetry: () => void; title?: string }) {
  const max = Math.max(...props.bars.map((b) => b.value), 0.0001);
  return (
    <div class="demo">
      <p class="demo-title">{props.title ?? 'Your results'}</p>
      <div class="results">
        {props.bars.map((b) => (
          <div class="bar-row" key={b.label}>
            <span>{b.label}</span>
            <div class="bar-track">
              <div class={`bar-fill ${b.highlight ? '' : 'muted'}`} style={{ width: `${(b.value / max) * 100}%` }} />
            </div>
            <span class="bar-val">{b.display}</span>
          </div>
        ))}
      </div>
      <div class="verdict">{props.verdict}</div>
      <button class={GHOST} onClick={props.onRetry}>
        Try again
      </button>
    </div>
  );
}

/** A two-option segmented toggle. */
export function Toggle<T extends string>(props: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div class="seg" role="group" aria-label={props.label}>
      {props.options.map((o) => (
        <button key={o.value} aria-pressed={props.value === o.value} onClick={() => props.onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
