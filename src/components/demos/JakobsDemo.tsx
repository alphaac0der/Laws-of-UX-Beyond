import type { ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { Intro, PRIMARY, Results, secs } from './shared';

type Phase = 'intro' | 'ready' | 'play' | 'done';

const Bag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 7h12l1 13H5zM9 7a3 3 0 0 1 6 0" />
  </svg>
);
const Glyph = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export default function JakobsDemo() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const start = useRef(0);

  const go = () => {
    setPhase('play');
    start.current = performance.now();
  };
  const miss = (id: string) => {
    setWrong(id);
    setTimeout(() => setWrong(null), 300);
  };
  const hit = () => {
    const t = [...times, performance.now() - start.current];
    setTimes(t);
    if (round === 0) {
      setRound(1);
      setPhase('ready');
    } else setPhase('done');
  };
  const reset = () => {
    setTimes([]);
    setRound(0);
    setPhase('ready');
  };

  if (phase === 'intro')
    return (
      <Intro
        title="Find the cart"
        text="We’ll show you two online shops. Your job: open your shopping cart as fast as you can."
        onStart={reset}
      />
    );

  if (phase === 'ready')
    return (
      <div class="demo">
        <div class="demo-center">
          <p class="demo-step">Shop {round + 1} of 2</p>
          <div class="demo-prompt">
            Task
            <strong>Open your cart</strong>
          </div>
          <button class={PRIMARY} onClick={go} autoFocus>
            Show the shop
          </button>
        </div>
      </div>
    );

  if (phase === 'play') {
    const b = (id: string, label: string, content: ComponentChildren, extra = '') => (
      <button key={id} class={`shop-hit ${extra} ${wrong === id ? 'wrong' : ''}`} aria-label={label} onClick={() => (id === 'cart' ? hit() : miss(id))}>
        {content}
      </button>
    );
    return (
      <div class="demo">
        <p class="demo-step" style={{ marginBottom: '12px' }}>
          Shop {round + 1} of 2 · Open your cart
        </p>
        {round === 0 ? (
          <div class="shop">
            <div class="shop-bar">
              <b class="shop-logo">Shoply</b>
              <div class="shop-nav">
                {b('n1', 'Women', 'Women')}
                {b('n2', 'Men', 'Men')}
                {b('n3', 'Sale', 'Sale')}
              </div>
              <div class="shop-search">Search products</div>
              {b('acc', 'Account', <Glyph d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" />, 'icon')}
              {b('cart', 'Cart', <Bag />, 'icon')}
            </div>
            <div class="shop-body">
              <div class="shop-card" /> <div class="shop-card" /> <div class="shop-card" />
            </div>
          </div>
        ) : (
          <div class="shop">
            <div class="shop-bar">
              {b('n1', 'Discover', 'Discover')}
              <b class="shop-logo" style={{ margin: '0 auto' }}>
                Shoply
              </b>
              {b('n3', 'Stories', 'Stories')}
            </div>
            <div class="shop-body weird">
              <div class="shop-side">
                {b('s1', 'Wishlist', <Glyph d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />, 'icon')}
                {b('s2', 'Gift', <Glyph d="M4 10h16v10H4zM2 7h20v3H2zM12 7v13" />, 'icon')}
                {b('s3', 'Box', <Glyph d="M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7" />, 'icon')}
                {b('cart', 'Basket', <Glyph d="M3 9h18l-2 11H5zM8 9l4-6 4 6" />, 'icon')}
                {b('s4', 'Tag', <Glyph d="M3 12V3h9l9 9-9 9z" />, 'icon')}
              </div>
              <div class="shop-card" /> <div class="shop-card" />
            </div>
          </div>
        )}
      </div>
    );
  }

  const [a, c] = times;
  return (
    <Results
      bars={[
        { label: 'Familiar shop', value: a, display: secs(a) },
        { label: 'Unusual shop', value: c, display: secs(c), highlight: true },
      ]}
      verdict={
        c > a * 1.2 ? (
          <>
            You were <strong>{(c / a).toFixed(1)}× slower</strong> in the unusual shop. You didn’t need to learn the
            first one, because you already knew from other shops that the cart lives in the top-right corner.
          </>
        ) : (
          <>
            Quick in both! Most people are much slower in the second shop because the cart isn’t where every other
            shop puts it.
          </>
        )
      }
      onRetry={reset}
    />
  );
}
