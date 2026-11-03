import { useState } from 'preact/hooks';
import { GHOST, Intro, PRIMARY, shuffle, wait } from './shared';

const POOL = [
  'Apple', 'River', 'Candle', 'Tiger', 'Pencil', 'Garden', 'Rocket', 'Mirror', 'Violin', 'Bridge', 'Cloud', 'Button',
  'Forest', 'Ladder', 'Planet', 'Window', 'Island', 'Hammer', 'Basket', 'Castle', 'Doctor', 'Feather', 'Lemon', 'Magnet',
];

type Mode = 'serial' | 'isolation';
const COUNT = { serial: 12, isolation: 10 };

export default function MemoryListDemo({ mode }: { mode: Mode }) {
  const [phase, setPhase] = useState<'intro' | 'show' | 'recall' | 'done'>('intro');
  const [list, setList] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [shown, setShown] = useState(-1);
  const [picked, setPicked] = useState<string[]>([]);
  const [odd, setOdd] = useState(0);

  async function start() {
    const words = shuffle(POOL);
    const l = words.slice(0, COUNT[mode]);
    setList(l);
    setOptions(shuffle(words.slice(0, COUNT[mode] + 8)));
    setPicked([]);
    const oddIndex = 3 + Math.floor(Math.random() * 4);
    setOdd(oddIndex);
    setPhase('show');
    if (mode === 'serial') {
      for (let i = 0; i < l.length; i++) {
        setShown(i);
        await wait(1100);
      }
    } else {
      setShown(0);
      await wait(4500);
    }
    setPhase('recall');
  }

  const toggle = (w: string) => setPicked((prev) => (prev.includes(w) ? prev.filter((p) => p !== w) : [...prev, w]));

  if (phase === 'intro')
    return (
      <Intro
        title="A quick memory test"
        text={
          mode === 'serial'
            ? 'We’ll show 12 words, one at a time. Then pick every word you remember.'
            : 'We’ll show a list of 10 words for a few seconds. Then pick every word you remember.'
        }
        onStart={start}
      />
    );

  if (phase === 'show')
    return (
      <div class="demo">
        <div class="demo-center">
          {mode === 'serial' ? (
            <>
              <p class="demo-step">
                Word {shown + 1} of {list.length}
              </p>
              <p class="big-seq" key={shown}>
                {list[shown]}
              </p>
            </>
          ) : (
            <ul class="word-list">
              {list.map((w, i) => (
                <li key={w} class={i === odd ? 'odd' : ''}>
                  {w}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );

  if (phase === 'recall')
    return (
      <div class="demo">
        <p class="demo-title">Which words did you see?</p>
        <p class="demo-text">Pick all the ones you remember. Some of these weren’t in the list.</p>
        <div class="word-grid">
          {options.map((w) => (
            <button key={w} class="chip-btn" aria-pressed={picked.includes(w)} onClick={() => toggle(w)}>
              {w}
            </button>
          ))}
        </div>
        <button class={PRIMARY} style={{ marginTop: '20px' }} onClick={() => setPhase('done')}>
          Show my results
        </button>
      </div>
    );

  const hits = list.map((w) => picked.includes(w));
  const total = hits.filter(Boolean).length;
  return (
    <div class="demo">
      <p class="demo-title">
        You remembered {total} of {list.length}
      </p>
      {mode === 'serial' ? (
        <>
          <div class="pos-chart" role="img" aria-label="Which positions you remembered">
            {hits.map((h, i) => (
              <div key={i} class={`${h ? 'hit' : ''} ${i < 3 || i > list.length - 4 ? 'edge' : ''}`}>
                <span>{i + 1}</span>
              </div>
            ))}
          </div>
          <p class="demo-step" style={{ textAlign: 'center' }}>
            Position in the list (filled = remembered)
          </p>
          <div class="verdict">
            Most people remember the <strong>first few</strong> words (they had time to repeat them) and the{' '}
            <strong>last few</strong> (they were still fresh). The middle gets lost. Check your chart: does it dip in
            the middle?
          </div>
        </>
      ) : (
        <div class="verdict">
          {hits[odd] ? (
            <>
              You remembered <strong>“{list[odd]}”</strong>, the highlighted word.
            </>
          ) : (
            <>
              You missed <strong>“{list[odd]}”</strong>, the highlighted one. Most people catch it.
            </>
          )}{' '}
          Of the other {list.length - 1} plain words you remembered{' '}
          {hits.filter((h, i) => h && i !== odd).length}. The item that looks different gets noticed and remembered,
          while the similar ones blur together.
        </div>
      )}
      <button class={GHOST} onClick={start}>
        Try again
      </button>
    </div>
  );
}
