import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { LEVELS, TOTAL_FLAWS } from './levels';
import { SpotContext, type SpotApi } from './Spot';

type Progress = { found: string[]; misses: number; hints: number; revealed: boolean };
const EMPTY: Progress = { found: [], misses: 0, hints: 0, revealed: false };
const KEY = 'find-the-flaws';

function load(): Record<string, Progress> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}
function save(all: Record<string, Progress>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

export default function FindTheFlaws(props: { laws: Record<string, string> }) {
  const [index, setIndex] = useState(0);
  const [all, setAll] = useState<Record<string, Progress>>({});
  const [hint, setHint] = useState('');
  const [toast, setToast] = useState<{ text: string; kind: 'found' | 'fine' | 'again'; n: number } | null>(null);
  const [latest, setLatest] = useState('');
  const toastTimer = useRef<number>();
  const panelRef = useRef<HTMLDivElement>(null);

  const level = LEVELS[index];
  const p = all[level.id] ?? EMPTY;
  const done = p.found.length === level.flaws.length;
  const over = done || p.revealed;
  const foundOverall = LEVELS.reduce((n, l) => n + (all[l.id]?.found.length ?? 0), 0);

  // Restore saved progress and the ?level= from the URL after the first render.
  useEffect(() => {
    setAll(load());
    const want = new URLSearchParams(location.search).get('level');
    const i = LEVELS.findIndex((l) => l.id === want);
    if (i > 0) setIndex(i);
  }, []);

  const update = (next: Partial<Progress>) => {
    setAll((prev) => {
      const merged = { ...prev, [level.id]: { ...(prev[level.id] ?? EMPTY), ...next } };
      save(merged);
      return merged;
    });
  };

  const flash = (text: string, kind: 'found' | 'fine' | 'again') => {
    clearTimeout(toastTimer.current);
    setToast({ text, kind, n: Date.now() });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const goTo = (i: number) => {
    setIndex(i);
    setHint('');
    setLatest('');
    setToast(null);
    const url = new URL(location.href);
    url.searchParams.set('level', LEVELS[i].id);
    history.replaceState(null, '', url);
  };

  // Order in which flaws get their numbered badge: found first, then any revealed.
  const order = useMemo(
    () => [...p.found, ...(p.revealed ? level.flaws.map((f) => f.id).filter((id) => !p.found.includes(id)) : [])],
    [p, level],
  );

  const api: SpotApi = {
    badge: (id) => order.indexOf(id) + 1,
    state: (id) => (p.found.includes(id) ? 'found' : p.revealed ? 'revealed' : ''),
    hit: (id) => {
      const flaw = level.flaws.find((f) => f.id === id)!;
      if (p.found.includes(id) || p.revealed) {
        flash(`Already spotted: ${props.laws[flaw.law]}`, 'again');
        return;
      }
      update({ found: [...p.found, id] });
      setLatest(id);
      setHint('');
      flash(`Found it: ${props.laws[flaw.law]}`, 'found');
    },
    miss: (note) => {
      if (over) return;
      update({ misses: p.misses + 1 });
      flash(note ?? 'Looks fine. Nothing wrong here.', 'fine');
    },
  };

  const giveHint = () => {
    const next = level.flaws.find((f) => !p.found.includes(f.id));
    if (!next) return;
    setHint(next.hint);
    update({ hints: p.hints + 1 });
  };

  // Newest find first, so it's visible without scrolling the panel.
  const cards = order.map((id) => level.flaws.find((f) => f.id === id)!).reverse();

  return (
    <div class="fx">
      <div class="fx-levels" role="group" aria-label="Choose a screen">
        {LEVELS.map((l, i) => {
          const lp = all[l.id];
          const complete = lp && (lp.found.length === l.flaws.length || lp.revealed);
          return (
            <button type="button" aria-pressed={i === index} onClick={() => goTo(i)}>
              <span class="fx-lnum">{complete ? '✓' : i + 1}</span>
              {l.title}
            </button>
          );
        })}
        <span class="fx-overall">
          {foundOverall} of {TOTAL_FLAWS} flaws found
        </span>
      </div>

      <div class="fx-game">
        <div class="fx-stage">
          <SpotContext.Provider value={api}>
            <level.Screen />
          </SpotContext.Provider>
          {toast && (
            <div class={`fx-toast ${toast.kind}`} key={toast.n}>
              {toast.text}
            </div>
          )}
        </div>

        <div class="fx-panel" ref={panelRef}>
          <p class="fx-kicker">
            Screen {index + 1} of {LEVELS.length}
          </p>
          <h2 class="fx-title">{level.title}</h2>
          <p class="fx-brief">{level.brief}</p>

          <div class="fx-progress">
            <div class="fx-pips" aria-hidden="true">
              {level.flaws.map((_, i) => (
                <i class={i < p.found.length ? 'on' : ''} />
              ))}
            </div>
            <span aria-live="polite">
              <b>{p.found.length}</b> of {level.flaws.length} found
              {p.misses > 0 && <> · {p.misses} {p.misses === 1 ? 'miss' : 'misses'}</>}
            </span>
          </div>

          {cards.length === 0 && (
            <p class="fx-empty">
              This screen has {level.flaws.length} UX mistakes. Click (or tab to) anything that looks wrong. Clicking
              something that’s fine counts as a miss.
            </p>
          )}

          {hint && !over && (
            <p class="fx-hint">
              <b>Hint:</b> {hint}
            </p>
          )}

          <ol class="fx-cards">
            {cards.map((f) => (
              <li class={`fx-card ${f.id === latest ? 'is-new' : ''} ${p.found.includes(f.id) ? '' : 'is-revealed'}`}>
                <span class="fx-card-num">{order.indexOf(f.id) + 1}</span>
                <div>
                  <a class="fx-law" href={`/laws/${f.law}`}>
                    {props.laws[f.law]} →
                  </a>
                  <strong>{f.title}</strong>
                  <p>{f.why}</p>
                  <p class="fx-fix">
                    <b>Fix:</b> {f.fix}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {over && (
            <p class="fx-done">
              {done ? (
                <>
                  <b>All {level.flaws.length} found</b> with {p.misses} {p.misses === 1 ? 'miss' : 'misses'} and{' '}
                  {p.hints} {p.hints === 1 ? 'hint' : 'hints'}.
                </>
              ) : (
                <>
                  <b>
                    You found {p.found.length} of {level.flaws.length}.
                  </b>{' '}
                  The rest are revealed above.
                </>
              )}
            </p>
          )}

          <div class="fx-actions">
            {!over && (
              <>
                <button type="button" class="demo-btn ghost" onClick={giveHint}>
                  Hint
                </button>
                <button type="button" class="fx-link" onClick={() => update({ revealed: true })}>
                  Show me the answers
                </button>
              </>
            )}
            {over && (
              <>
                <button type="button" class="demo-btn" onClick={() => goTo((index + 1) % LEVELS.length)}>
                  {index + 1 < LEVELS.length ? 'Next screen →' : 'Back to the first screen'}
                </button>
                <button
                  type="button"
                  class="fx-link"
                  onClick={() => {
                    update({ ...EMPTY });
                    setLatest('');
                    setHint('');
                  }}
                >
                  Play again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
