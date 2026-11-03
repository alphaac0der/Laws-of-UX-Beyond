import { useRef, useState } from 'preact/hooks';
import { Intro, PRIMARY, Results, secs } from './shared';

const ANSWERS = ['$41.50', '$47.50', '$52.00', '$38.90'];
const CORRECT = '$47.50';

function Receipt({ busy }: { busy: boolean }) {
  return busy ? (
    <div class="receipt busy" aria-label="Order summary">
      <div class="busy-promo">🔥 FLASH DEAL 🔥 Add 2 more items &amp; save $12.40! Ends in 04:59</div>
      <div class="r-row"><span>Item #44291 Mug (x2) <i>was $29.98</i></span><b>$24.00</b></div>
      <div class="busy-promo alt">⭐ 4.8 (2,391) · 37 people viewing · Only 3 left!</div>
      <div class="r-row"><span>Item #10933 Tea set <i>-15%</i></span><b>$17.00</b></div>
      <div class="r-row small"><span>Points earned: 475 · Worth $4.75</span><b>+475</b></div>
      <div class="r-row"><span>Shipping <i>Free over $60!</i></span><b>$6.50</b></div>
      <div class="r-row small"><span>You saved $9.48 today 🎉 · Gift wrap? +$3.99</span><b>—</b></div>
      <div class="r-row total"><span>Order total</span><b>$47.50</b></div>
      <div class="busy-promo">Klarna: 4 payments of $11.88 · Apple Pay · PayPal</div>
    </div>
  ) : (
    <div class="receipt" aria-label="Order summary">
      <div class="r-row"><span>Mugs (2)</span><b>$24.00</b></div>
      <div class="r-row"><span>Tea set</span><b>$17.00</b></div>
      <div class="r-row"><span>Shipping</span><b>$6.50</b></div>
      <div class="r-row total"><span>Total</span><b>$47.50</b></div>
    </div>
  );
}

export default function CognitiveLoadDemo() {
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro');
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const start = useRef(0);

  const show = (r: number) => {
    setRound(r);
    setPhase('play');
    start.current = performance.now();
  };
  const answer = (a: string) => {
    if (a !== CORRECT) {
      setWrong(a);
      setTimeout(() => setWrong(null), 300);
      return;
    }
    const t = [...times, performance.now() - start.current];
    setTimes(t);
    if (round === 0) show(1);
    else setPhase('done');
  };

  if (phase === 'intro')
    return (
      <Intro
        title="What will you pay?"
        text="We’ll show two checkout summaries. Find the total you’ll pay and pick it below, as fast as you can."
        onStart={() => {
          setTimes([]);
          show(0);
        }}
      />
    );

  if (phase === 'play')
    return (
      <div class="demo">
        <p class="demo-step" style={{ marginBottom: '12px' }}>
          Summary {round + 1} of 2 · What’s the total?
        </p>
        <Receipt busy={round === 0} />
        <div class="choice-grid four" style={{ marginTop: '16px' }}>
          {ANSWERS.map((a) => (
            <button key={a} class={`choice ${wrong === a ? 'wrong' : ''}`} onClick={() => answer(a)}>
              {a}
            </button>
          ))}
        </div>
      </div>
    );

  const [busy, calm] = times;
  return (
    <Results
      bars={[
        { label: 'Busy summary', value: busy, display: secs(busy), highlight: true },
        { label: 'Calm summary', value: calm, display: secs(calm) },
      ]}
      verdict={
        <>
          The total was the same both times. In the busy version, every badge, timer and crossed-out price was
          something your brain had to read and dismiss before it found the answer. That extra mental work is{' '}
          <strong>cognitive load</strong>. (It was also a bit easier the second time, because you already knew what
          to look for.)
        </>
      }
      onRetry={() => {
        setTimes([]);
        show(0);
      }}
    />
  );
}
