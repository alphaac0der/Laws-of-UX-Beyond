import { useState } from 'preact/hooks';

const TASKS = [
  { id: 'tz', task: 'Work out the arrival time in local time', user: 'You do the time-zone maths', sys: 'The app shows local arrival time' },
  { id: 'code', task: 'Find the right airport', user: 'You look up the 3-letter airport code', sys: 'You type “London”, the app suggests airports' },
  { id: 'fees', task: 'Know the real total price', user: 'You add up taxes and bag fees yourself', sys: 'The app shows one final price' },
  { id: 'docs', task: 'Check if you need a visa', user: 'You search government websites', sys: 'The app checks your passport and route' },
];

export default function TeslerDemo() {
  const [bySystem, setBySystem] = useState<Record<string, boolean>>({});
  const sys = TASKS.filter((t) => bySystem[t.id]).length;
  const user = TASKS.length - sys;

  return (
    <div class="demo">
      <p class="demo-title">Booking a flight: who handles the hard parts?</p>
      <p class="demo-text">
        Every booking has these four pieces of complexity. You can’t delete them, only decide who deals with them.
        Flip each one.
      </p>
      <ul class="tesler-list">
        {TASKS.map((t) => {
          const on = !!bySystem[t.id];
          return (
            <li key={t.id}>
              <div>
                <b>{t.task}</b>
                <span>{on ? t.sys : t.user}</span>
              </div>
              <button
                class="switch"
                role="switch"
                aria-checked={on}
                aria-label={`${t.task}: handled by ${on ? 'the app' : 'the user'}`}
                onClick={() => setBySystem((prev) => ({ ...prev, [t.id]: !prev[t.id] }))}
              >
                <span>{on ? 'App' : 'User'}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div class="meters">
        <div>
          <span>User effort</span>
          <div class="bar-track">
            <div class="bar-fill" style={{ width: `${(user / TASKS.length) * 100}%` }} />
          </div>
        </div>
        <div>
          <span>Work for the design & dev team</span>
          <div class="bar-track">
            <div class="bar-fill muted" style={{ width: `${(sys / TASKS.length) * 100}%` }} />
          </div>
        </div>
      </div>
      <p class="live" aria-live="polite">
        {sys === 0
          ? 'All 4 problems land on the user.'
          : sys === TASKS.length
            ? 'The total complexity is still 4. The team carries all of it now.'
            : `Still 4 problems in total: ${user} for the user, ${sys} for the team.`}
      </p>
    </div>
  );
}
