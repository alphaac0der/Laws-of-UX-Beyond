import { useState } from 'preact/hooks';
import { Toggle } from './shared';

const SAMPLES = ['(555) 123-4567', '555.123.4567', '+1 555 123 4567', '555 1234 567', '555-12'];

function check(raw: string, forgiving: boolean): { ok: boolean; msg: string } {
  if (!raw.trim()) return { ok: false, msg: 'Type a phone number or tap an example.' };
  if (!forgiving) {
    return /^\d{10}$/.test(raw)
      ? { ok: true, msg: 'Accepted.' }
      : { ok: false, msg: 'Invalid format. Use 10 digits with no spaces or symbols.' };
  }
  let d = raw.replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  if (d.length !== 10) return { ok: false, msg: `That has ${d.length} digits. A US number needs 10.` };
  return { ok: true, msg: `Got it: (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` };
}

export default function PostelDemo() {
  const [mode, setMode] = useState<'strict' | 'forgiving'>('strict');
  const [val, setVal] = useState('(555) 123-4567');
  const r = check(val, mode === 'forgiving');

  return (
    <div class="demo">
      <div class="demo-top" style={{ alignItems: 'center' }}>
        <p class="demo-title" style={{ margin: 0 }}>
          A phone number field
        </p>
        <Toggle
          label="Validation style"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'strict', label: 'Strict' },
            { value: 'forgiving', label: 'Forgiving' },
          ]}
        />
      </div>
      <p class="demo-text">
        People write phone numbers in lots of ways. Try the examples in both modes and see which field works with
        people instead of against them.
      </p>
      <div class="chip-row">
        {SAMPLES.map((s) => (
          <button key={s} class="chip-btn" aria-pressed={val === s} onClick={() => setVal(s)}>
            {s}
          </button>
        ))}
      </div>
      <label class="demo-field" style={{ maxWidth: '360px' }}>
        <span>Phone number</span>
        <input
          class={`demo-input ${r.ok ? '' : 'invalid'}`}
          value={val}
          inputMode="tel"
          onInput={(e) => setVal((e.target as HTMLInputElement).value)}
        />
        <small class={r.ok ? 'msg-ok' : 'msg-bad'} aria-live="polite">
          {r.msg}
        </small>
      </label>
    </div>
  );
}
