import { useState } from 'preact/hooks';
import { GHOST } from './shared';

function Form({ polished }: { polished: boolean }) {
  return (
    <div class={polished ? 'ui' : 'ui ui-plain'} aria-hidden="true">
      <div class="ui-title">Create account</div>
      <div class="ui-stack">
        {['Email', 'Password'].map((l) => (
          <div key={l}>
            <span class="ui-label" style={{ marginBottom: polished ? '6px' : '2px' }}>
              {l}
            </span>
            <div class="ui-input" />
          </div>
        ))}
      </div>
      <div class={polished ? 'ui-btn primary block' : 'ui-btn'} style={{ marginTop: '14px' }}>
        Sign up
      </div>
    </div>
  );
}

export default function AestheticDemo() {
  const [pick, setPick] = useState<'a' | 'b' | null>(null);

  return (
    <div class="demo">
      <p class="demo-title">Which form looks easier to use?</p>
      <p class="demo-text">Go with your gut. Pick one.</p>
      <div class="pick-grid">
        {(['a', 'b'] as const).map((k) => (
          <button
            key={k}
            class={`pick ${pick === k ? 'is-picked' : ''}`}
            onClick={() => setPick(k)}
            aria-pressed={pick === k}
          >
            <Form polished={k === 'b'} />
            <span class="pick-label">Form {k.toUpperCase()}</span>
          </button>
        ))}
      </div>
      {pick && (
        <div class="verdict" style={{ marginTop: '20px' }}>
          {pick === 'b' ? (
            <>
              You picked the polished one, like <strong>most people do</strong>.
            </>
          ) : (
            <>Interesting! Most people pick Form B.</>
          )}{' '}
          But look again: both forms have <strong>exactly the same two fields and one button</strong>. Nothing about
          B is actually easier. It just <em>looks</em> easier, and that changes how we judge it.
        </div>
      )}
      {pick && (
        <button class={GHOST} onClick={() => setPick(null)}>
          Reset
        </button>
      )}
    </div>
  );
}
