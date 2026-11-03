import { useState } from 'preact/hooks';

function zone(skill: number, challenge: number) {
  const d = challenge - skill;
  if (d > 25) return { name: 'Anxiety', text: 'Too hard for your skill. Think of a complex tool with no guidance: people feel lost and quit.' };
  if (d < -25) return { name: 'Boredom', text: 'Too easy for your skill. Think of an expert forced through a beginner wizard: people tune out.' };
  return { name: 'Flow', text: 'Challenge matches skill. Time disappears and people stay focused, like a game that gets harder as you improve.' };
}

export default function FlowDemo() {
  const [skill, setSkill] = useState(50);
  const [challenge, setChallenge] = useState(50);
  const z = zone(skill, challenge);

  return (
    <div class="demo">
      <div class="demo-split" style={{ alignItems: 'center' }}>
        <svg class="flow-chart" viewBox="0 0 220 220" role="img" aria-label={`You are in the ${z.name} zone`}>
          <path d="M20 20 L155 20 L20 155 Z" class="z-anx" />
          <path d="M20 155 L155 20 L200 20 L200 65 L65 200 L20 200 Z" class="z-flow" />
          <path d="M65 200 L200 200 L200 65 Z" class="z-bore" />
          <text x="62" y="62" class="z-label">Anxiety</text>
          <text x="110" y="114" class="z-label strong" transform="rotate(-45 110 110)">Flow</text>
          <text x="160" y="180" class="z-label">Boredom</text>
          <path d="M20 200H205M20 200V15" class="z-axis" />
          <text x="112" y="216" class="z-axis-label">Skill →</text>
          <text x="10" y="110" class="z-axis-label" transform="rotate(-90 10 110)">Challenge →</text>
          <circle cx={20 + skill * 1.8} cy={200 - challenge * 1.8} r="8" class="z-dot" />
        </svg>
        <div>
          <p class="demo-title">Find the flow channel</p>
          <p class="demo-text">Move both sliders. Flow happens when the challenge grows along with skill.</p>
          <div class="slider">
            <label for="flow-skill">
              <span>User’s skill</span>
              <span>{skill}</span>
            </label>
            <input id="flow-skill" type="range" min={0} max={100} value={skill} onInput={(e) => setSkill(Number((e.target as HTMLInputElement).value))} />
          </div>
          <div class="slider">
            <label for="flow-challenge">
              <span>Task challenge</span>
              <span>{challenge}</span>
            </label>
            <input id="flow-challenge" type="range" min={0} max={100} value={challenge} onInput={(e) => setChallenge(Number((e.target as HTMLInputElement).value))} />
          </div>
          <div class="verdict" aria-live="polite" style={{ marginTop: '12px' }}>
            <strong>{z.name}.</strong> {z.text}
          </div>
        </div>
      </div>
    </div>
  );
}
