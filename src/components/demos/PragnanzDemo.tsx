import { useState } from 'preact/hooks';
import { GHOST } from './shared';

const OPTIONS = ['A square', 'A circle', 'Something odd-shaped'];

export default function PragnanzDemo() {
  const [guess, setGuess] = useState<string | null>(null);
  const revealed = guess !== null;

  return (
    <div class="demo">
      <div class="demo-split">
        <svg class="pragnanz" viewBox="0 0 240 200" role="img" aria-label={revealed ? 'The hidden shape is a jagged, irregular shape' : 'A circle covering part of another shape'}>
          <path
            d="M50 40H150V52L170 70L130 85L175 100L135 115L170 135L150 148V160H50z"
            class="g-hidden"
          />
          <circle cx="150" cy="100" r="56" class={`g-cover ${revealed ? 'moved' : ''}`} />
        </svg>
        <div>
          <p class="demo-title">What shape is hiding behind the circle?</p>
          <p class="demo-text">Don’t think too hard. What does your brain fill in?</p>
          <div class="chip-row">
            {OPTIONS.map((o) => (
              <button key={o} class="chip-btn" aria-pressed={guess === o} disabled={revealed} onClick={() => setGuess(o)}>
                {o}
              </button>
            ))}
          </div>
          {revealed && (
            <>
              <div class="verdict">
                {guess === 'A square' ? <>You guessed a square, like most people. </> : <>Most people guess a square. </>}
                It was actually a jagged shape. Your brain filled the gap with the <strong>simplest shape</strong> that
                fit what it could see.
              </div>
              <button class={GHOST} onClick={() => setGuess(null)}>
                Reset
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
