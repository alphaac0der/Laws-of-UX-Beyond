import { useState } from 'preact/hooks';

const STEPS = ['Create your account', 'Add a profile photo', 'Write a short bio', 'Connect your calendar', 'Invite a teammate'];

export default function ZeigarnikDemo() {
  const [done, setDone] = useState<boolean[]>([true, true, false, false, false]);
  const count = done.filter(Boolean).length;
  const pct = Math.round((count / STEPS.length) * 100);
  const next = done.indexOf(false);

  return (
    <div class="demo">
      <div class="demo-split" style={{ alignItems: 'start' }}>
        <div>
          <p class="demo-title">An unfinished checklist</p>
          <p class="demo-text">
            This is a typical “set up your profile” card. Notice the little itch to finish it? Tick the remaining steps
            and watch how the open items keep pulling at you until they’re done.
          </p>
          <p class="live" aria-live="polite" style={{ textAlign: 'left' }}>
            {count === STEPS.length ? 'Done. That itch is gone.' : `${STEPS.length - count} left… you want to finish, don’t you?`}
          </p>
        </div>
        <div class="checkcard">
          <div class="checkcard-head">
            <b>Profile setup</b>
            <span>{pct}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style={{ width: `${pct}%`, transition: 'width .4s' }} />
          </div>
          <ul>
            {STEPS.map((s, i) => (
              <li key={s}>
                <button
                  role="checkbox"
                  aria-checked={done[i]}
                  class={`${done[i] ? 'done' : ''} ${i === next ? 'next' : ''}`}
                  onClick={() => setDone((prev) => prev.map((d, k) => (k === i ? !d : d)))}
                >
                  <span class="box" aria-hidden="true" />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
