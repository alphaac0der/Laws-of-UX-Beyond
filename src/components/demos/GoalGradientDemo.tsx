import { useState } from 'preact/hooks';
import { GHOST, PRIMARY } from './shared';

function Card({ total, given, bought, name }: { total: number; given: number; bought: number; name: string }) {
  const filled = Math.min(total, given + bought);
  return (
    <div class="stampcard">
      <div class="checkcard-head">
        <b>{name}</b>
        <span>{Math.round((filled / total) * 100)}%</span>
      </div>
      <div class="stamps" style={{ gridTemplateColumns: `repeat(${total / 2}, 1fr)` }}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} class={i < given ? 'gift' : i < filled ? 'on' : ''} />
        ))}
      </div>
      <p class="demo-step">{total - filled === 0 ? 'Free coffee!' : `${total - filled} to go`}</p>
    </div>
  );
}

export default function GoalGradientDemo() {
  const [bought, setBought] = useState(0);
  return (
    <div class="demo">
      <p class="demo-title">Two coffee loyalty cards</p>
      <p class="demo-text">
        Both cards need exactly <strong>10 coffees</strong> for a free one. Card B just has 12 boxes with 2 already
        stamped as a gift. Buy coffees and compare how close each one feels.
      </p>
      <div class="pick-grid">
        <Card name="Card A" total={10} given={0} bought={bought} />
        <Card name="Card B" total={12} given={2} bought={bought} />
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button class={PRIMARY} onClick={() => setBought((b) => Math.min(10, b + 1))} disabled={bought >= 10}>
          Buy a coffee ({bought}/10)
        </button>
        {bought > 0 && (
          <button class={GHOST} onClick={() => setBought(0)}>
            Reset
          </button>
        )}
      </div>
      <p class="live" aria-live="polite" style={{ marginTop: '12px' }}>
        {bought === 0
          ? 'Same effort, but B already looks 17% done.'
          : bought < 10
            ? 'Card B always looks further along. In a real study, people with card B finished faster.'
            : 'Both done after 10 coffees. Only the feeling of progress was different.'}
      </p>
    </div>
  );
}
