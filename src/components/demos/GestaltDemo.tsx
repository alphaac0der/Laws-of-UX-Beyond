import { useState } from 'preact/hooks';
import { Toggle } from './shared';

type Mode = 'region' | 'similarity' | 'connected';

const COPY: Record<Mode, { title: string; text: string; off: string; on: string; before: string; after: string }> = {
  region: {
    title: 'Same dots, add a background',
    text: 'These 12 dots are evenly spaced. Switch on the backgrounds and watch how you suddenly see groups.',
    off: 'No backgrounds',
    on: 'Backgrounds',
    before: 'A plain grid. No groups.',
    after: 'Three groups of four, just from shared backgrounds.',
  },
  similarity: {
    title: 'Same grid, change the look',
    text: 'Every dot is evenly spaced. Change how every other column looks, and the grid turns into columns.',
    off: 'All the same',
    on: 'Alternate columns',
    before: 'Rows? Columns? Hard to say.',
    after: 'Now it reads as columns, even though nothing moved.',
  },
  connected: {
    title: 'Proximity vs. a line',
    text: 'The dots are arranged in close pairs. Now connect them differently and see which wins.',
    off: 'No lines',
    on: 'Connect',
    before: 'Clearly pairs: 1–2, 3–4, 5–6.',
    after: 'Now you see 2–3 and 4–5. The lines beat the spacing.',
  },
};

export default function GestaltDemo({ mode }: { mode: Mode }) {
  const [on, setOn] = useState(false);
  const c = COPY[mode];

  return (
    <div class="demo">
      <div class="demo-top" style={{ alignItems: 'center' }}>
        <p class="demo-title" style={{ margin: 0 }}>
          {c.title}
        </p>
        <Toggle
          label="Toggle grouping"
          value={on ? 'on' : 'off'}
          onChange={(v) => setOn(v === 'on')}
          options={[
            { value: 'off', label: c.off },
            { value: 'on', label: c.on },
          ]}
        />
      </div>
      <p class="demo-text">{c.text}</p>
      <svg class="gestalt" viewBox="0 0 360 160" role="img" aria-label={on ? c.after : c.before}>
        {mode === 'region' &&
          [0, 1, 2].map((g) => (
            <rect
              key={g}
              x={14 + g * 116}
              y="20"
              width="100"
              height="120"
              rx="16"
              class={`g-region ${on ? 'on' : ''}`}
            />
          ))}
        {mode === 'region' &&
          Array.from({ length: 12 }, (_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            return <circle key={i} cx={40 + col * 56} cy={55 + row * 50} r="11" class="g-dot" />;
          })}

        {mode === 'similarity' &&
          Array.from({ length: 32 }, (_, i) => {
            const col = i % 8;
            const row = Math.floor(i / 8);
            const x = 40 + col * 40;
            const y = 26 + row * 36;
            return on && col % 2 ? (
              <rect key={i} x={x - 10} y={y - 10} width="20" height="20" rx="3" class="g-dot accent" />
            ) : (
              <circle key={i} cx={x} cy={y} r="10" class="g-dot" />
            );
          })}

        {mode === 'connected' && (
          <>
            {on &&
              [
                [1, 2],
                [3, 4],
              ].map(([a, b]) => (
                <line key={a} x1={xs[a]} y1="80" x2={xs[b]} y2="80" class="g-line" />
              ))}
            {xs.map((x, i) => (
              <circle key={i} cx={x} cy="80" r="13" class={`g-dot ${on && i > 0 && i < 5 ? 'accent' : ''}`} />
            ))}
          </>
        )}
      </svg>
      <p class="live" aria-live="polite">
        {on ? c.after : c.before}
      </p>
    </div>
  );
}

const xs = [40, 84, 160, 204, 280, 324];
