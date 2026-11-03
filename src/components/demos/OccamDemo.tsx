import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { GHOST } from './shared';

type Part = { id: string; label: string; required?: boolean; render: () => JSX.Element };

const PARTS: Part[] = [
  { id: 'tips', label: 'Tips paragraph', render: () => <p class="ui-muted">Tip: photos under 10 MB upload faster. JPG, PNG and HEIC are supported.</p> },
  { id: 'drop', label: 'Drop zone', required: true, render: () => <div class="ui-drop">Drop a photo here</div> },
  { id: 'rename', label: 'Rename field', render: () => <div class="ui-input" /> },
  { id: 'quality', label: 'Quality slider', render: () => <div class="ui-track" /> },
  { id: 'water', label: 'Watermark toggle', render: () => <div class="ui-row"><span class="ui-toggle" /> <span class="ui-muted">Add watermark</span></div> },
  { id: 'share', label: 'Share buttons', render: () => <div class="ui-row"><span class="ui-btn">Share</span><span class="ui-btn">Tweet</span><span class="ui-btn">Email</span></div> },
  { id: 'upload', label: 'Upload button', required: true, render: () => <div class="ui-btn primary block">Upload</div> },
];

export default function OccamDemo() {
  const [removed, setRemoved] = useState<string[]>([]);
  const [warn, setWarn] = useState('');
  const left = PARTS.filter((p) => !removed.includes(p.id));
  const optionalLeft = left.filter((p) => !p.required).length;

  function remove(p: Part) {
    if (p.required) {
      setWarn(`Without the ${p.label.toLowerCase()}, nobody can upload anything. That one has to stay.`);
      return;
    }
    setWarn('');
    setRemoved((prev) => [...prev, p.id]);
  }

  return (
    <div class="demo">
      <div class="demo-split" style={{ alignItems: 'start' }}>
        <div>
          <p class="demo-title">Simplify this upload dialog</p>
          <p class="demo-text">
            Click any part of the dialog to remove it. Keep going until only what’s truly needed is left.
          </p>
          <p class="demo-step">
            Parts left: {left.length} of {PARTS.length}
          </p>
          {warn && <div class="verdict" style={{ marginTop: '12px' }}>{warn}</div>}
          {optionalLeft === 0 && (
            <div class="verdict" style={{ marginTop: '12px' }}>
              <strong>Done.</strong> Two parts, and the job still gets done. Everything else was a choice someone had
              to read, understand and skip.
            </div>
          )}
          {removed.length > 0 && (
            <button class={GHOST} style={{ marginTop: '8px' }} onClick={() => { setRemoved([]); setWarn(''); }}>
              Start over
            </button>
          )}
        </div>
        <div class="ui occam" aria-label="Upload dialog">
          <div class="ui-title">Upload photo</div>
          {left.map((p) => (
            <button key={p.id} class="occam-part" onClick={() => remove(p)} aria-label={`Remove ${p.label}`}>
              {p.render()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
