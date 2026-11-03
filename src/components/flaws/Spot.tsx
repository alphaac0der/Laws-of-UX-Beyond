import { createContext, type ComponentChildren } from 'preact';
import { useContext, useState } from 'preact/hooks';

export type SpotApi = {
  /** Number shown on a flaw once it's found or revealed, otherwise 0. */
  badge: (id: string) => number;
  state: (id: string) => '' | 'found' | 'revealed';
  hit: (id: string) => void;
  miss: (note?: string) => void;
};
export const SpotContext = createContext<SpotApi | null>(null);

/**
 * Anything in a mock screen the player can click. Pass `f` (a flaw id) for a mistake;
 * leave it out for an element that is fine, so clicking it counts as a miss.
 * Fine elements are clickable too, so neither hovering nor tabbing gives the flaws away.
 */
export function Spot(props: {
  f?: string;
  note?: string;
  inline?: boolean;
  class?: string;
  style?: string | Record<string, string | number>;
  children: ComponentChildren;
}) {
  const api = useContext(SpotContext)!;
  const [flash, setFlash] = useState(false);
  const state = props.f ? api.state(props.f) : '';
  const badge = props.f ? api.badge(props.f) : 0;
  const Tag = props.inline ? 'span' : 'div';

  const act = () => {
    if (props.f) return api.hit(props.f);
    api.miss(props.note);
    setFlash(true);
    setTimeout(() => setFlash(false), 650);
  };

  return (
    <Tag
      role="button"
      tabIndex={0}
      class={`fx-spot ${state ? `is-${state}` : ''} ${flash ? 'is-fine' : ''} ${props.class ?? ''}`}
      style={props.style}
      onClick={(e) => {
        e.stopPropagation();
        act();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          act();
        }
      }}
    >
      {props.children}
      {badge > 0 && (
        <span class="fx-badge" aria-hidden="true">
          {badge}
        </span>
      )}
    </Tag>
  );
}
