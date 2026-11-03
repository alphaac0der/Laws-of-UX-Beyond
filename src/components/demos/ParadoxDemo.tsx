import { useRef, useState } from 'preact/hooks';
import { GHOST, Intro, PRIMARY } from './shared';

const STEPS = [
  'Welcome to PhotoPro! Before you begin, this short tour explains every part of the editor so you can get the most out of it.',
  'The toolbar on the left has 14 tools grouped into 4 categories: Select, Adjust, Retouch and Export. Each one has its own settings panel.',
  'Layers let you stack edits without changing the original. You can reorder, hide, lock, merge and group layers from the Layers panel.',
  'Keyboard shortcuts speed things up. Press ⌘K to see all 63 of them, or customise them in Preferences → Keys.',
  'Presets save your favourite combinations of adjustments. You can import presets made by others and share your own.',
  'You’re ready! Remember you can replay this tour from Help → Tour at any time.',
];

export default function ParadoxDemo() {
  const [phase, setPhase] = useState<'intro' | 'tour' | 'done'>('intro');
  const [step, setStep] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [time, setTime] = useState(0);
  const start = useRef(0);

  const begin = () => {
    setStep(0);
    setSkipped(false);
    setPhase('tour');
    start.current = performance.now();
  };
  const end = (skip: boolean) => {
    setSkipped(skip);
    setTime(performance.now() - start.current);
    setPhase('done');
  };

  if (phase === 'intro')
    return (
      <Intro
        title="Open a new app"
        text="You just installed a photo editor and want to fix one photo. Open it and do whatever you’d normally do."
        cta="Open PhotoPro"
        onStart={begin}
      />
    );

  if (phase === 'tour')
    return (
      <div class="demo">
        <div class="tour">
          <p class="demo-step">
            Tour · Step {step + 1} of {STEPS.length}
          </p>
          <p>{STEPS[step]}</p>
          <div class="tour-actions">
            <button class={GHOST} onClick={() => end(true)}>
              Skip tour
            </button>
            <button class={PRIMARY} onClick={() => (step + 1 < STEPS.length ? setStep(step + 1) : end(false))}>
              {step + 1 < STEPS.length ? 'Next' : 'Start editing'}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div class="demo">
      <p class="demo-title">{skipped ? `You skipped at step ${step + 1}` : 'You read the whole tour!'}</p>
      <div class="verdict">
        {skipped ? (
          <>
            It took you <strong>{(time / 1000).toFixed(1)} seconds</strong> to decide you’d rather just start. That’s
            what most people do. They came to fix a photo, not to study an editor.
          </>
        ) : (
          <>
            You’re patient! Most people skip within the first step or two. They came to get something done, and the
            tour feels like it’s in the way.
          </>
        )}{' '}
        Instead of a tour up front, teach people <strong>at the moment they need it</strong>, like a small hint the
        first time they open the Layers panel.
      </div>
      <button class={GHOST} onClick={begin}>
        Try again
      </button>
    </div>
  );
}
