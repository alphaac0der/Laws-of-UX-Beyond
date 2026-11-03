import { useRef, useState } from 'preact/hooks';
import { Intro, PRIMARY, Results, secs } from './shared';

const ADDRESS = { name: 'Sam Rivera', street: '12 Hill Road', city: 'Leeds' };
type Key = keyof typeof ADDRESS;

export default function ParkinsonDemo() {
  const [phase, setPhase] = useState<'intro' | 'manual' | 'auto' | 'done'>('intro');
  const [vals, setVals] = useState<Record<Key, string>>({ name: '', street: '', city: '' });
  const [times, setTimes] = useState<number[]>([]);
  const start = useRef(0);

  const begin = (p: 'manual' | 'auto') => {
    setVals({ name: '', street: '', city: '' });
    setPhase(p);
    start.current = performance.now();
  };
  const done = vals.name === ADDRESS.name && vals.street === ADDRESS.street && vals.city === ADDRESS.city;
  const submit = (e: Event) => {
    e.preventDefault();
    if (!done) return;
    const t = [...times, performance.now() - start.current];
    setTimes(t);
    if (phase === 'manual') begin('auto');
    else setPhase('done');
  };

  if (phase === 'intro')
    return (
      <Intro
        title="The checkout test"
        text="Fill in a delivery address twice: once by typing it, once with a saved address. We’ll time both."
        onStart={() => {
          setTimes([]);
          begin('manual');
        }}
      />
    );

  if (phase === 'done') {
    const [m, a] = times;
    return (
      <Results
        bars={[
          { label: 'Typing', value: m, display: secs(m), highlight: true },
          { label: 'Saved address', value: a, display: secs(a) },
        ]}
        verdict={
          <>
            Same task, <strong>{secs(m - a)} faster</strong>. Work grows to fill the time and effort a form asks for.
            The best way to make it smaller is to remove the work entirely.
          </>
        }
        onRetry={() => {
          setTimes([]);
          begin('manual');
        }}
      />
    );
  }

  return (
    <div class="demo">
      <p class="demo-step" style={{ marginBottom: '12px' }}>
        {phase === 'manual' ? 'Round 1 of 2 · Type the address shown' : 'Round 2 of 2 · Use the saved address'}
      </p>
      <form class="demo-form" onSubmit={submit}>
        {phase === 'manual' ? (
          <p class="demo-text" style={{ margin: 0 }}>
            Type: <b>{ADDRESS.name}</b>, <b>{ADDRESS.street}</b>, <b>{ADDRESS.city}</b>
          </p>
        ) : (
          <button type="button" class="saved" onClick={() => setVals({ ...ADDRESS })}>
            <b>Use saved address</b>
            <span>
              {ADDRESS.name}, {ADDRESS.street}, {ADDRESS.city}
            </span>
          </button>
        )}
        {(Object.keys(ADDRESS) as Key[]).map((k) => (
          <label key={k} class="demo-field">
            <span>{k === 'name' ? 'Full name' : k === 'street' ? 'Street' : 'City'}</span>
            <input
              class="demo-input"
              value={vals[k]}
              autoComplete="off"
              onInput={(e) => {
                const v = (e.target as HTMLInputElement).value;
                setVals((prev) => ({ ...prev, [k]: v }));
              }}
            />
          </label>
        ))}
        <button class={PRIMARY} type="submit" disabled={!done}>
          Continue to payment
        </button>
      </form>
    </div>
  );
}
