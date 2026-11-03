import { useState } from 'preact/hooks';

const FEATURES = [
  ['Take photo', 52],
  ['Share', 28],
  ['Crop', 5],
  ['Filters', 4],
  ['Albums', 3],
  ['Timer', 3],
  ['Grid lines', 2],
  ['RAW mode', 1],
  ['Night mode', 1],
  ['Levels', 1],
] as const;

export default function ParetoDemo() {
  const [n, setN] = useState(2);
  const covered = FEATURES.slice(0, n).reduce((s, [, v]) => s + v, 0);

  return (
    <div class="demo">
      <p class="demo-title">A camera app with 10 features</p>
      <p class="demo-text">
        Each bar shows how often a feature gets used. Move the slider to see how much of all usage the top features
        cover.
      </p>
      <div class="pareto">
        {FEATURES.map(([name, v], i) => (
          <div key={name} class={`bar-row ${i < n ? '' : 'dim'}`}>
            <span>{name}</span>
            <div class="bar-track">
              <div class={`bar-fill ${i < n ? '' : 'muted'}`} style={{ width: `${(v / 52) * 100}%` }} />
            </div>
            <span class="bar-val">{v}%</span>
          </div>
        ))}
      </div>
      <div class="slider">
        <label for="pareto-n">
          <span>Top features included</span>
          <span>
            {n} of 10 ({n * 10}%)
          </span>
        </label>
        <input id="pareto-n" type="range" min={1} max={10} value={n} onInput={(e) => setN(Number((e.target as HTMLInputElement).value))} />
      </div>
      <p class="live" aria-live="polite">
        {n * 10}% of the features cover {covered}% of all use.
      </p>
    </div>
  );
}
