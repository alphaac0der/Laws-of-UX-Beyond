import { useRef, useState } from 'preact/hooks';
import { GHOST, Intro, PRIMARY, secs } from './shared';

export default function SelectiveDemo() {
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro');
  const [code, setCode] = useState('');
  const [found, setFound] = useState(false);
  const [time, setTime] = useState(0);
  const start = useRef(0);

  const begin = () => {
    setCode('');
    setFound(false);
    setPhase('play');
    start.current = performance.now();
  };
  const submit = (e: Event) => {
    e.preventDefault();
    setFound(code.trim().toUpperCase() === 'SAVE20');
    setTime(performance.now() - start.current);
    setPhase('done');
  };

  if (phase === 'intro')
    return (
      <Intro
        title="Find the discount code"
        text="We’ll show you a shop page. Somewhere on it is a discount code. Find it and type it in."
        onStart={begin}
      />
    );

  if (phase === 'play')
    return (
      <div class="demo">
        <div class="article">
          <div class="ad-banner" aria-label="Banner">
            <b>SUMMER SALE</b> · Use code <b>SAVE20</b> at checkout · Limited time only!
          </div>
          <div class="article-grid">
            <div>
              <div class="ui-img" style={{ height: '120px' }} />
              <h4>Linen Shirt, Sand</h4>
              <p>$48 · Free returns within 30 days. Made from 100% European linen, pre-washed for softness.</p>
              <p>Need help? Our support team can apply discounts for you. Just ask in chat.</p>
            </div>
            <div class="ad-side" aria-hidden="true">
              <span>Sponsored</span>
              <div />
            </div>
          </div>
        </div>
        <form class="inline-form" onSubmit={submit}>
          <label class="demo-field" style={{ flex: 1 }}>
            <span>Discount code</span>
            <input class="demo-input mono" value={code} onInput={(e) => setCode((e.target as HTMLInputElement).value)} autoComplete="off" />
          </label>
          <button class={PRIMARY} type="submit">
            Apply
          </button>
          <button class={GHOST} type="button" onClick={() => { setTime(performance.now() - start.current); setPhase('done'); }}>
            I give up
          </button>
        </form>
      </div>
    );

  return (
    <div class="demo">
      <p class="demo-title">{found ? `Found it in ${secs(time)}` : 'The code was in the banner at the top'}</p>
      <div class="verdict">
        {found ? (
          <>
            Nice! But notice where it was: inside the bright <strong>banner</strong>. Many people skip that area
            completely because it <em>looks like an ad</em>, and they’ve learned to tune ads out.
          </>
        ) : (
          <>
            It was right there in big letters: <strong>SAVE20</strong>. Your eyes skipped it because it looked like an
            ad, and our brains have learned to tune ads out. This is called <strong>banner blindness</strong>.
          </>
        )}
      </div>
      <button class={GHOST} onClick={begin}>
        Try again
      </button>
    </div>
  );
}
