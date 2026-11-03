import { useState } from 'preact/hooks';

const DOTS = 12;
const GROUP = 4;
const INNER = 8;

function verdict(gap: number) {
  if (gap < 6) return 'One row of 12 dots.';
  if (gap < 18) return 'Hmm… are those groups?';
  return 'Clearly 3 groups of 4.';
}

export default function ProximityDemo() {
  const [gap, setGap] = useState(0);
  const [grouped, setGrouped] = useState(false);

  // Even spacing: label sits halfway between fields, so it's ambiguous which field it belongs to.
  const labelGap = grouped ? 6 : 14;
  const fieldGap = grouped ? 24 : 14;

  return (
    <div class="demo">
      <p class="demo-title">1 · Move the slider</p>
      <p class="demo-text">The dots never change color, shape or size. Only the space between them changes.</p>
      <div class="dots" aria-hidden="true">
        {Array.from({ length: DOTS }, (_, i) => (
          <i key={i} style={{ marginLeft: `${i === 0 ? 0 : i % GROUP === 0 ? INNER + gap : INNER}px` }} />
        ))}
      </div>
      <div class="slider">
        <label for="prox-gap">
          <span>Space between groups</span>
          <span>{gap}px</span>
        </label>
        <input
          id="prox-gap"
          type="range"
          min={0}
          max={48}
          value={gap}
          onInput={(e) => setGap(Number((e.target as HTMLInputElement).value))}
        />
      </div>
      <p class="live" aria-live="polite">
        {verdict(gap)}
      </p>

      <div class="demo-divider" />

      <p class="demo-title">2 · Now in a real form</p>
      <div class="demo-split">
        <div>
          <p class="demo-text">
            With even spacing, each label floats halfway between two fields. Does “Email” belong to the box above or
            below it? Switch to grouped and the question goes away.
          </p>
          <div class="seg" role="group" aria-label="Spacing style">
            <button aria-pressed={!grouped} onClick={() => setGrouped(false)}>
              Even spacing
            </button>
            <button aria-pressed={grouped} onClick={() => setGrouped(true)}>
              Grouped
            </button>
          </div>
        </div>
        <div class="ui" style={{ margin: '0 auto' }} aria-hidden="true">
          {['Full name', 'Email', 'Password'].map((l, i) => (
            <div key={l} style={{ marginTop: `${i === 0 ? 0 : fieldGap}px`, transition: 'margin .3s' }}>
              <span class="ui-label" style={{ marginBottom: `${labelGap}px`, transition: 'margin .3s' }}>
                {l}
              </span>
              <div class="ui-input" />
            </div>
          ))}
          <div class="ui-btn primary block" style={{ marginTop: "20px" }}>
            Create account
          </div>
        </div>
      </div>
    </div>
  );
}
