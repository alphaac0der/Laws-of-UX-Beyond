import type { ComponentChildren, JSX } from 'preact';
import { Fix, Spot } from './Spot';

export type Flaw = {
  id: string;
  /** Lesson slug in src/content/laws. */
  law: string;
  title: string;
  why: string;
  fix: string;
  hint: string;
};

export type Level = {
  id: string;
  /** Matching id in src/data/patterns.ts, so pattern pages can link here. */
  pattern: string;
  title: string;
  brief: string;
  flaws: Flaw[];
  /** The broken screen the player clicks on. */
  Screen: () => JSX.Element;
  /** The same screen with every flaw fixed, shown side by side once the level is over. */
  Fixed: () => JSX.Element;
};

/* ---------- Small building blocks for the mock screens ---------- */

const Input = (p: { text?: string; mono?: boolean; muted?: boolean; eye?: boolean }) => (
  <div class={`fx-input ${p.mono ? 'mono' : ''} ${p.muted ? 'muted' : ''}`}>
    {p.text ?? ''}
    {p.eye && (
      <span class="fx-eye" title="Show password">
        <Icon d={I.eye} size={15} />
      </span>
    )}
  </div>
);
/** A note on the fixed screen about something that was removed, so there's nothing to draw. */
const Note = (p: { children: ComponentChildren }) => <div class="fx-note">{p.children}</div>;
const Label = (p: { children: ComponentChildren; style?: string }) => (
  <div class="fx-label" style={p.style}>
    {p.children}
  </div>
);
const Icon = (p: { d: string; size?: number; fill?: boolean }) => (
  <svg
    width={p.size ?? 16}
    height={p.size ?? 16}
    viewBox="0 0 24 24"
    fill={p.fill ? 'currentColor' : 'none'}
    stroke={p.fill ? 'none' : 'currentColor'}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d={p.d} />
  </svg>
);
const I = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  gift: 'M4 11h16v10H4zM2 7h20v4H2zM12 7v14M12 7S10 3 7.5 3a2 2 0 0 0 0 4M12 7s2-4 4.5-4a2 2 0 0 1 0 4',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6M12 17h.01',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
};

/** Sorted bars with the long tail grouped, the fix for the 3D pie. */
function Bars() {
  const rows: [string, number][] = [
    ['US', 22],
    ['UK', 17],
    ['Germany', 13],
    ['India', 11],
    ['Canada', 9],
    ['Other', 28],
  ];
  return (
    <div class="fx-bars">
      {rows.map(([k, v]) => (
        <div>
          <span>{k}</span>
          <i style={`width:${(v / 28) * 100}%`} />
          <b>{v}%</b>
        </div>
      ))}
    </div>
  );
}

/** A pie chart drawn with fake 3D depth, for the dashboard level. */
function Pie3D() {
  const values = [22, 17, 13, 11, 9, 8, 7, 6, 4, 3];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#a3a3a3'];
  const total = values.reduce((a, b) => a + b, 0);
  const [cx, cy, rx, ry] = [70, 42, 62, 28];
  let a = -Math.PI / 2;
  const wedges = values.map((v, i) => {
    const b = a + (v / total) * Math.PI * 2;
    const p = (t: number, dy = 0) => `${(cx + rx * Math.cos(t)).toFixed(1)} ${(cy + dy + ry * Math.sin(t)).toFixed(1)}`;
    const large = b - a > Math.PI ? 1 : 0;
    const d = `M${cx} ${cy}L${p(a)}A${rx} ${ry} 0 ${large} 1 ${p(b)}Z`;
    const side = `M${p(a)}L${p(a, 12)}A${rx} ${ry} 0 ${large} 1 ${p(b, 12)}L${p(b)}A${rx} ${ry} 0 ${large} 0 ${p(a)}Z`;
    a = b;
    return { d, side, color: colors[i] };
  });
  return (
    <svg viewBox="0 0 140 86" width="150" aria-hidden="true">
      {wedges.map((w) => (
        <path d={w.side} fill={w.color} style="filter:brightness(0.7)" />
      ))}
      {wedges.map((w) => (
        <path d={w.d} fill={w.color} stroke="#fff" stroke-width="0.6" />
      ))}
    </svg>
  );
}

/* ---------- Levels ---------- */

export const LEVELS: Level[] = [
  {
    id: 'sign-up',
    pattern: 'forms',
    title: 'Sign-up form',
    brief: 'A free-trial sign-up for a project management tool. Fewer people finish it than the team hoped.',
    flaws: [
      {
        id: 'proximity',
        law: 'law-of-proximity',
        title: 'The Email label sits closer to the field above it',
        why: 'People pair a label with whatever is nearest. “Email” hugs the name field and floats away from its own box, so the form reads wrong at a glance.',
        fix: 'Put each label right above its own field, and leave bigger gaps between fields than inside them.',
        hint: 'Look at the space around each label.',
      },
      {
        id: 'postel',
        law: 'postels-law',
        title: 'The phone field accepts only one exact format',
        why: 'People type phone numbers with spaces, dashes and brackets. Rejecting all of those makes them fix something the computer could clean up itself.',
        fix: 'Accept any reasonable format, strip the extra characters yourself, and show the number back neatly.',
        hint: 'Read the small print under the fields.',
      },
      {
        id: 'occam',
        law: 'occams-razor',
        title: 'Three questions nobody needs to answer yet',
        why: 'Company, job title and “How did you hear about us?” don’t help anyone start a trial. Every extra field is one more reason to give up.',
        fix: 'Ask only for what’s needed to sign up. Ask the rest later, or never.',
        hint: 'Which fields could you delete without breaking anything?',
      },
      {
        id: 'restorff',
        law: 'von-restorff-effect',
        title: 'Cancel stands out more than Create account',
        why: 'The eye goes straight to the one element that looks different. Here that’s Cancel, so the main action looks like the secondary one.',
        fix: 'Make Create account the only filled button, and turn Cancel into a quiet text link.',
        hint: 'Which button does your eye land on first?',
      },
    ],
    Screen: () => (
      <div class="fx-screen">
        <Spot note="A clear heading that says what the page is for. Nothing wrong here.">
          <div class="fx-h">Create your account</div>
          <div class="fx-sub">Start your free 14-day trial.</div>
        </Spot>
        <Spot style="margin-top:16px" note="A clear label right above its field. Fine.">
          <Label>Full name</Label>
          <Input text="Alex Morgan" />
        </Spot>
        <Spot f="proximity" style="margin-top:4px">
          <Label>Email</Label>
          <div style="margin-top:22px">
            <Input />
          </div>
        </Spot>
        <Spot f="postel" style="margin-top:14px">
          <Label>Phone</Label>
          <Input text="+1-555-555-5555" muted />
          <div class="fx-help bad">Use this exact format. No spaces or brackets.</div>
        </Spot>
        <Spot f="occam" style="margin-top:14px">
          <div class="fx-two">
            <div>
              <Label>Company</Label>
              <Input />
            </div>
            <div>
              <Label>Job title</Label>
              <Input />
            </div>
          </div>
          <Label style="margin-top:12px">How did you hear about us?</Label>
          <div class="fx-input fx-select">Choose one</div>
        </Spot>
        <Spot style="margin-top:14px" note="Hidden by default, with an eye icon to check what you typed. Fine.">
          <Label>Password</Label>
          <Input text="••••••••••" eye />
        </Spot>
        <Spot f="restorff" style="margin-top:20px">
          <div class="fx-row end">
            <span class="fx-btn ghost small">Create account</span>
            <span class="fx-btn primary">Cancel</span>
          </div>
        </Spot>
        <Spot style="margin-top:14px" note="Linking the terms is good practice. Fine.">
          <div class="fx-fine">
            By signing up you agree to our <u>Terms</u> and <u>Privacy Policy</u>.
          </div>
        </Spot>
      </div>
    ),
    Fixed: () => (
      <div class="fx-screen">
        <div class="fx-h">Create your account</div>
        <div class="fx-sub">Start your free 14-day trial.</div>
        <div style="margin-top:16px">
          <Label>Full name</Label>
          <Input text="Alex Morgan" />
        </div>
        <Fix f="proximity" style="margin-top:14px">
          <Label>Email</Label>
          <Input text="alex@example.com" />
        </Fix>
        <Fix f="postel" style="margin-top:14px">
          <Label>Phone</Label>
          <Input text="(555) 123 4567" />
          <div class="fx-help ok">Any format works. We’ll tidy it up.</div>
        </Fix>
        <Fix f="occam" style="margin-top:14px">
          <Note>Company, job title and “How did you hear about us?” are gone. Ask later, if at all.</Note>
        </Fix>
        <div style="margin-top:14px">
          <Label>Password</Label>
          <Input text="••••••••••" eye />
        </div>
        <Fix f="restorff" style="margin-top:20px">
          <span class="fx-btn primary block">Create account</span>
          <div class="fx-sub fx-center" style="margin-top:10px">
            <u>Cancel</u>
          </div>
        </Fix>
        <div class="fx-fine" style="margin-top:14px">
          By signing up you agree to our <u>Terms</u> and <u>Privacy Policy</u>.
        </div>
      </div>
    ),
  },

  {
    id: 'checkout',
    pattern: 'checkout',
    title: 'Checkout',
    brief: 'The last step of an online shop. Lots of people reach this page and then leave without paying.',
    flaws: [
      {
        id: 'steps',
        law: 'law-of-uniform-connectedness',
        title: 'The steps look like four unrelated words',
        why: 'Nothing connects them or shows where you are, so checkout doesn’t read as one journey with an end in sight.',
        fix: 'Join the steps with a line, fill it up to the current step, and highlight where the person is.',
        hint: 'Look at the very top. Where am I?',
      },
      {
        id: 'tesler',
        law: 'teslers-law',
        title: 'You can’t see what you’ll actually pay',
        why: 'Shipping and tax are complexity the system can handle. Pushing them to a later step makes people guess, and surprise costs are a top reason carts get abandoned.',
        fix: 'Estimate shipping and tax from the address or location, and show one total up front.',
        hint: 'Can you tell what this will cost in total?',
      },
      {
        id: 'bias',
        law: 'cognitive-bias',
        title: 'A paid add-on is ticked for you',
        why: 'People tend to stick with defaults. Pre-ticking a paid extra uses that bias against them. It may lift revenue once, but it costs trust.',
        fix: 'Leave optional extras unticked and explain them plainly.',
        hint: 'Check every checkbox.',
      },
      {
        id: 'chunking',
        law: 'chunking',
        title: '16 digits in one unbroken string',
        why: 'A long run of digits is hard to read and check. Groups of four match how the number is printed on the card, and typos become easy to spot.',
        fix: 'Format the number in groups of four as the person types.',
        hint: 'Try reading the card number back.',
      },
    ],
    Screen: () => (
      <div class="fx-screen">
        <Spot f="steps">
          <div class="fx-row spread fx-steps">
            <span>Cart</span>
            <span>Shipping</span>
            <span>Payment</span>
            <span>Review</span>
          </div>
        </Spot>
        <Spot style="margin-top:16px" note="Showing what’s in the order reassures people. Fine.">
          <div class="fx-row">
            <div class="fx-thumb" />
            <div style="flex:1">
              <b>Canvas tote bag</b>
              <div class="fx-sub">Natural · Qty 1</div>
            </div>
            <b>$38.00</b>
          </div>
        </Spot>
        <Spot f="tesler" style="margin-top:14px">
          <div class="fx-lines">
            <div>
              <span>Subtotal</span>
              <span>$38.00</span>
            </div>
            <div>
              <span>Shipping</span>
              <span class="fx-sub">Calculated at next step</span>
            </div>
            <div>
              <span>Taxes</span>
              <span class="fx-sub">Calculated at next step</span>
            </div>
          </div>
        </Spot>
        <Spot f="bias" style="margin-top:14px">
          <div class="fx-row">
            <span class="fx-check on">
              <Icon d={I.check} size={11} />
            </span>
            <span>
              Add Purchase Protection <b>(+$9.99)</b>
            </span>
          </div>
        </Spot>
        <Spot f="chunking" style="margin-top:16px">
          <Label>Card number</Label>
          <Input text="4242424242424242" mono />
        </Spot>
        <Spot style="margin-top:12px" note="Expiry and security code side by side is a familiar layout. Fine.">
          <div class="fx-two">
            <div>
              <Label>Expiry</Label>
              <Input text="08 / 28" mono />
            </div>
            <div>
              <Label>CVC</Label>
              <Input text="•••" mono />
            </div>
          </div>
        </Spot>
        <Spot style="margin-top:18px" note="A big, clear, full-width button. Good.">
          <span class="fx-btn primary block">Pay now</span>
        </Spot>
      </div>
    ),
    Fixed: () => (
      <div class="fx-screen">
        <Fix f="steps">
          <div class="fx-stepper">
            <span class="done">Cart</span>
            <span class="done">Shipping</span>
            <span class="on">Payment</span>
            <span>Review</span>
          </div>
        </Fix>
        <div class="fx-row" style="margin-top:16px">
          <div class="fx-thumb" />
          <div style="flex:1">
            <b>Canvas tote bag</b>
            <div class="fx-sub">Natural · Qty 1</div>
          </div>
          <b>$38.00</b>
        </div>
        <Fix f="tesler" style="margin-top:14px">
          <div class="fx-lines">
            <div>
              <span>Subtotal</span>
              <span>$38.00</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>$4.95</span>
            </div>
            <div>
              <span>Tax (estimated)</span>
              <span>$3.42</span>
            </div>
            <div class="total">
              <b>Total</b>
              <b>$46.37</b>
            </div>
          </div>
        </Fix>
        <Fix f="bias" style="margin-top:14px">
          <div class="fx-row" style="align-items:start">
            <span class="fx-check" />
            <span>
              Add Purchase Protection (+$9.99)
              <div class="fx-sub">Covers loss or damage for a year. Optional.</div>
            </span>
          </div>
        </Fix>
        <Fix f="chunking" style="margin-top:16px">
          <Label>Card number</Label>
          <Input text="4242 4242 4242 4242" mono />
        </Fix>
        <div class="fx-two" style="margin-top:12px">
          <div>
            <Label>Expiry</Label>
            <Input text="08 / 28" mono />
          </div>
          <div>
            <Label>CVC</Label>
            <Input text="•••" mono />
          </div>
        </div>
        <span class="fx-btn primary block" style="margin-top:18px">
          Pay $46.37
        </span>
      </div>
    ),
  },

  {
    id: 'pricing',
    pattern: 'pricing',
    title: 'Pricing page',
    brief: 'Plans for a video editing app. Visitors spend ages on this page, and many leave without picking anything.',
    flaws: [
      {
        id: 'banner',
        law: 'selective-attention',
        title: 'The most important news is dressed up like an ad',
        why: 'People learn to skip anything loud, boxed and shouty at the top of a page (“banner blindness”). The price rise is the one thing they need to know, and it’s styled to be ignored.',
        fix: 'Put the notice next to the prices, in the page’s normal style.',
        hint: 'What would you scroll straight past?',
      },
      {
        id: 'toggle',
        law: 'mental-model',
        title: '“1 | 12” means nothing to most people',
        why: 'It mirrors how the billing system works (a billing period in months), not how people think. Customers think in “monthly” and “yearly”.',
        fix: 'Label the options Monthly and Yearly, and say how much yearly saves.',
        hint: 'Would your parents understand every label?',
      },
      {
        id: 'hick',
        law: 'hicks-law',
        title: 'Six plans and no recommendation',
        why: 'Every extra option adds decision time, and with nothing highlighted people have to compare all six themselves. Many leave to “think about it”.',
        fix: 'Offer three plans and highlight the one most people should choose.',
        hint: 'How long does it take you to choose?',
      },
      {
        id: 'memory',
        law: 'working-memory',
        title: 'Each plan’s features live on a separate page',
        why: 'To compare plans, people have to open page after page and remember what they saw. Working memory holds only a few things at once.',
        fix: 'Show the key features of every plan side by side in one comparison table.',
        hint: 'How would you compare two plans?',
      },
    ],
    Screen: () => (
      <div class="fx-screen wide">
        <Spot f="banner">
          <div class="fx-ad">LIMITED OFFER!!! Prices go up on Monday. Lock in today’s price NOW!!!</div>
        </Spot>
        <div class="fx-row spread" style="margin-top:16px;align-items:end">
          <Spot note="A clear heading. Fine.">
            <div class="fx-h">Plans for every creator</div>
            <div class="fx-sub">Cancel anytime.</div>
          </Spot>
          <Spot f="toggle">
            <div class="fx-row" style="gap:6px">
              <span class="fx-sub">Billing cycle</span>
              <span class="fx-seg">
                <span class="on">1</span>
                <span>12</span>
              </span>
            </div>
          </Spot>
        </div>
        <Spot f="hick" style="margin-top:16px">
          <div class="fx-plans">
            {[
              ['Starter', '$4'],
              ['Basic', '$7'],
              ['Plus', '$11'],
              ['Pro', '$15'],
              ['Studio', '$24'],
              ['Business', '$39'],
            ].map(([n, p]) => (
              <div class="fx-plan">
                <span>{n}</span>
                <b>
                  {p}
                  <small>/mo</small>
                </b>
                <span class="fx-btn tiny">Choose</span>
              </div>
            ))}
          </div>
        </Spot>
        <Spot f="memory" style="margin-top:14px">
          <div class="fx-sub">
            See what’s included: <u>Starter</u> · <u>Basic</u> · <u>Plus</u> · <u>Pro</u> · <u>Studio</u> · <u>Business</u>{' '}
            (each opens its own page)
          </div>
        </Spot>
        <Spot style="margin-top:14px" note="Offering a human to talk to is helpful. Fine.">
          <div class="fx-fine">
            Questions? <u>Talk to our team</u>
          </div>
        </Spot>
      </div>
    ),
    Fixed: () => (
      <div class="fx-screen wide">
        <div class="fx-row spread" style="align-items:end">
          <div>
            <div class="fx-h">Plans for every creator</div>
            <div class="fx-sub">Cancel anytime.</div>
          </div>
          <Fix f="toggle">
            <span class="fx-seg">
              <span class="on">Monthly</span>
              <span>Yearly · save 20%</span>
            </span>
          </Fix>
        </div>
        <Fix f="banner" style="margin-top:12px">
          <div class="fx-notice">Prices go up on 1 June. Start a plan before then to keep today’s price.</div>
        </Fix>
        <Fix f="hick" style="margin-top:14px">
          <div class="fx-plans three">
            {[
              ['Basic', '$7', false],
              ['Pro', '$15', true],
              ['Business', '$39', false],
            ].map(([n, p, pick]) => (
              <div class={`fx-plan ${pick ? 'is-pick' : ''}`}>
                {pick && <em>Most popular</em>}
                <span>{n}</span>
                <b>
                  {p}
                  <small>/mo</small>
                </b>
                <span class={`fx-btn tiny ${pick ? 'primary' : ''}`}>Choose</span>
              </div>
            ))}
          </div>
        </Fix>
        <Fix f="memory" style="margin-top:14px">
          <table class="fx-table">
            <thead>
              <tr>
                <th />
                <td>Basic</td>
                <td>Pro</td>
                <td>Business</td>
              </tr>
            </thead>
            <tbody>
              {[
                ['Projects', '3', 'Unlimited', 'Unlimited'],
                ['4K export', '–', '✓', '✓'],
                ['Team seats', '1', '1', '10'],
              ].map((r) => (
                <tr>
                  {r.map((c, i) => (i === 0 ? <th>{c}</th> : <td>{c}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </Fix>
        <div class="fx-fine" style="margin-top:14px">
          Questions? <u>Talk to our team</u>
        </div>
      </div>
    ),
  },

  {
    id: 'mobile-home',
    pattern: 'mobile',
    title: 'Mobile home screen',
    brief: 'The home screen of a recipe-box app. People say it feels slow and confusing to get around.',
    flaws: [
      {
        id: 'jakob',
        law: 'jakobs-law',
        title: 'Search hides behind a compass icon',
        why: 'People spend most of their time in other apps, where search is a magnifying glass or a search bar near the top. An original icon makes them hunt for it.',
        fix: 'Use the standard search icon, or a search bar at the top of the screen.',
        hint: 'Try to search for a recipe.',
      },
      {
        id: 'fitts',
        law: 'fitts-law',
        title: 'The close button is a tiny target',
        why: 'A 12-pixel × in a corner is hard to hit with a thumb, so people tap the offer by mistake, or give up.',
        fix: 'Make the close target at least 44 × 44 px, even if the icon itself stays small.',
        hint: 'Try closing the offer with your thumb.',
      },
      {
        id: 'doherty',
        law: 'doherty-threshold',
        title: 'Nothing to look at while it loads',
        why: 'After about 400 ms, waiting starts to feel like the app is broken. A spinner and “please wait” make every second feel longer.',
        fix: 'Show the layout straight away (skeleton cards or saved recipes) and fill it in as data arrives.',
        hint: 'What does the main area show?',
      },
      {
        id: 'serial',
        law: 'serial-position-effect',
        title: 'The least-used tabs get the best spots',
        why: 'People notice and remember the first and last items in a row best. Here those spots go to Gifts and FAQ, while Home is lost in the middle.',
        fix: 'Put the key destinations, like Home and Profile, at the two ends of the bar.',
        hint: 'Look at the order of the tabs.',
      },
    ],
    Screen: () => (
      <div class="fx-phone">
        <div class="fx-row spread">
          <Spot note="A clear greeting. Fine.">
            <div class="fx-sub">Good evening</div>
            <div class="fx-h">What’s cooking?</div>
          </Spot>
          <Spot f="jakob">
            <span class="fx-icon-btn">
              <Icon d={I.compass} size={18} />
            </span>
          </Spot>
        </div>
        <Spot f="fitts" style="margin-top:14px">
          <div class="fx-promo">
            <b>20% off your next box</b>
            <div>Use code FRESH20 at checkout.</div>
            <span class="fx-x" aria-hidden="true">
              ×
            </span>
          </div>
        </Spot>
        <Spot f="doherty" style="margin-top:14px">
          <div class="fx-loading">
            <span class="fx-spin" />
            <div>Loading your recipes…</div>
            <div class="fx-sub">Please wait</div>
          </div>
        </Spot>
        <Spot f="serial" style="margin-top:14px">
          <div class="fx-tabs">
            {[
              [I.gift, 'Gifts'],
              [I.box, 'Orders'],
              [I.home, 'Home'],
              [I.user, 'Profile'],
              [I.help, 'FAQ'],
            ].map(([d, n]) => (
              <span class={n === 'Home' ? 'on' : ''}>
                <Icon d={d} size={17} />
                {n}
              </span>
            ))}
          </div>
        </Spot>
      </div>
    ),
    Fixed: () => (
      <div class="fx-phone">
        <div class="fx-row spread">
          <div>
            <div class="fx-sub">Good evening</div>
            <div class="fx-h">What’s cooking?</div>
          </div>
          <Fix f="jakob">
            <span class="fx-icon-btn">
              <Icon d={I.search} size={18} />
            </span>
          </Fix>
        </div>
        <Fix f="fitts" style="margin-top:14px">
          <div class="fx-promo roomy">
            <b>20% off your next box</b>
            <div>Use code FRESH20 at checkout.</div>
            <span class="fx-x big" aria-hidden="true">
              ×
            </span>
          </div>
        </Fix>
        <Fix f="doherty" style="margin-top:14px">
          <div class="fx-skel">
            {[0, 1, 2].map(() => (
              <div>
                <i />
                <span>
                  <s />
                  <s class="short" />
                </span>
              </div>
            ))}
          </div>
        </Fix>
        <Fix f="serial" style="margin-top:14px">
          <div class="fx-tabs">
            {[
              [I.home, 'Home'],
              [I.box, 'Orders'],
              [I.gift, 'Gifts'],
              [I.help, 'FAQ'],
              [I.user, 'Profile'],
            ].map(([d, n], i) => (
              <span class={i === 0 ? 'on' : ''}>
                <Icon d={d} size={17} />
                {n}
              </span>
            ))}
          </div>
        </Fix>
      </div>
    ),
  },

  {
    id: 'onboarding',
    pattern: 'onboarding',
    title: 'Onboarding',
    brief: 'The first screen of a budgeting app after sign-up. Half of new users never get past it.',
    flaws: [
      {
        id: 'gradient',
        law: 'goal-gradient-effect',
        title: 'Twelve steps to go, and nothing done yet',
        why: 'Motivation grows as the finish line gets closer. An empty bar with eleven steps still to go makes setup feel like a long way off.',
        fix: 'Cut or merge steps, and count what’s already done (“Account created ✓”) so the bar starts partly filled.',
        hint: 'How far away does the finish feel?',
      },
      {
        id: 'load',
        law: 'cognitive-load',
        title: 'A wall of text before anything else',
        why: 'Every sentence costs a little thinking. Nobody reads a block like this on a phone, and the one useful line gets lost.',
        fix: 'Say it in one short line, and show details only when they’re needed.',
        hint: 'Would you read all of it?',
      },
      {
        id: 'tour',
        law: 'paradox-of-the-active-user',
        title: 'A six-slide tour before you can do anything',
        why: 'People want to get going, not study. Most will skip the tour, then miss the tips when they actually need them.',
        fix: 'Let people start right away, and show each tip next to its feature the first time it’s used.',
        hint: 'What stands between the user and the app?',
      },
      {
        id: 'similarity',
        law: 'law-of-similarity',
        title: 'Skip and Continue look exactly alike',
        why: 'Things that look the same seem to do the same thing. The main step forward should look different from the way out.',
        fix: 'Make Continue a filled primary button, and Skip a quiet text link.',
        hint: 'Which button should you press?',
      },
    ],
    Screen: () => (
      <div class="fx-phone">
        <Spot f="gradient">
          <div class="fx-row spread fx-sub">
            <span>Step 1 of 12</span>
            <span>Setup</span>
          </div>
          <div class="fx-track">
            <span style="width:0%" />
          </div>
        </Spot>
        <Spot style="margin-top:18px" note="A friendly welcome. Fine.">
          <div class="fx-h">Welcome to Budgetly</div>
        </Spot>
        <Spot f="load" style="margin-top:8px">
          <p class="fx-wall">
            Budgetly helps you take control of your finances by connecting your accounts, categorizing your transactions
            automatically using our proprietary engine, letting you create flexible budgets with rollover rules, and
            giving you insights and reports across custom time ranges, so that you can plan ahead and reach your
            savings goals faster than ever before.
          </p>
        </Spot>
        <Spot f="tour" style="margin-top:14px">
          <div class="fx-tour">
            <b>Before you start: 6 quick tips</b>
            <div class="fx-sub">Swipe to read them all</div>
            <div class="fx-dots">
              <i class="on" />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </Spot>
        <Spot f="similarity" style="margin-top:16px">
          <div class="fx-two">
            <span class="fx-btn ghost block">Skip</span>
            <span class="fx-btn ghost block">Continue</span>
          </div>
        </Spot>
      </div>
    ),
    Fixed: () => (
      <div class="fx-phone">
        <Fix f="gradient">
          <div class="fx-row spread fx-sub">
            <span>Step 2 of 4</span>
            <span>Account created ✓</span>
          </div>
          <div class="fx-track">
            <span style="width:25%" />
          </div>
        </Fix>
        <div class="fx-h" style="margin-top:18px">
          Welcome to Budgetly
        </div>
        <Fix f="load" style="margin-top:8px">
          <p class="fx-lede">Connect your bank to see all your spending in one place.</p>
        </Fix>
        <Fix f="tour" style="margin-top:14px">
          <Note>No tour up front. Each tip appears next to its feature the first time you use it.</Note>
        </Fix>
        <Fix f="similarity" style="margin-top:16px">
          <span class="fx-btn primary block">Continue</span>
          <div class="fx-sub fx-center" style="margin-top:10px">
            <u>Skip for now</u>
          </div>
        </Fix>
      </div>
    ),
  },

  {
    id: 'dashboard',
    pattern: 'dashboards',
    title: 'Analytics dashboard',
    brief: 'The home page of a website analytics tool. Managers open it every morning, and still ask the team “so how are we doing?”',
    flaws: [
      {
        id: 'pareto',
        law: 'pareto-principle',
        title: 'Twelve numbers, all equally loud',
        why: 'A few metrics drive most decisions. When everything gets the same size, nothing tells people where to look first.',
        fix: 'Promote the two or three numbers that matter most, and move the rest into a details view.',
        hint: 'Which number matters most? Can you tell?',
      },
      {
        id: 'pragnanz',
        law: 'law-of-pragnanz',
        title: 'A 3D pie chart with ten slices',
        why: 'People read simple shapes most easily. The fake perspective distorts slice sizes, and ten slices are too many to compare.',
        fix: 'Use a simple sorted bar chart, or show the top few and group the rest as “Other”.',
        hint: 'Look at the chart. Which slice is bigger?',
      },
      {
        id: 'region',
        law: 'law-of-common-region',
        title: 'Two lists run into each other',
        why: 'With no shared background or border, “Top pages” and “Top sources” blur into one long list.',
        fix: 'Put each list in its own card, or give it a background, so it reads as one group.',
        hint: 'Where does one list end and the next begin?',
      },
      {
        id: 'flow',
        law: 'flow',
        title: 'A rating pop-up interrupts the work',
        why: 'Flow needs uninterrupted focus. A pop-up in the middle of a task breaks concentration, and asking for a rating before people have got any value annoys them.',
        fix: 'Ask later, at a natural pause after something has gone well, and never on top of the work itself.',
        hint: 'What gets in the way?',
      },
    ],
    Screen: () => (
      <div class="fx-screen wide fx-dash">
        <Spot note="A clear page title with the date range. Fine.">
          <div class="fx-row spread">
            <div class="fx-h">Overview</div>
            <span class="fx-sub">Last 7 days</span>
          </div>
        </Spot>
        <Spot f="pareto" style="margin-top:12px">
          <div class="fx-kpis">
            {[
              ['Visitors', '48.2k'],
              ['Sessions', '61.0k'],
              ['Bounce', '41%'],
              ['Pages/visit', '3.2'],
              ['Avg. time', '2m 41s'],
              ['New users', '31.9k'],
              ['Returning', '16.3k'],
              ['Sign-ups', '1,204'],
              ['Revenue', '$18.4k'],
              ['Churn', '2.1%'],
              ['Tickets', '87'],
              ['Uptime', '99.9%'],
            ].map(([k, v]) => (
              <div>
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
        </Spot>
        <div class="fx-two" style="margin-top:12px;align-items:start">
          <Spot f="pragnanz">
            <div class="fx-sub" style="margin-bottom:4px">Traffic by country</div>
            <Pie3D />
          </Spot>
          <Spot f="region">
            <div class="fx-plain-list">
              <b>Top pages</b>
              <span>/pricing 4.2k</span>
              <span>/blog/launch 3.1k</span>
              <span>/docs 2.7k</span>
              <b>Top sources</b>
              <span>google.com 5.4k</span>
              <span>newsletter 2.2k</span>
              <span>x.com 1.1k</span>
            </div>
          </Spot>
        </div>
        <Spot f="flow" class="fx-popup">
          <b>Enjoying Metrics?</b>
          <div class="fx-stars">★★★★★</div>
          <span class="fx-btn tiny">Rate us</span> <span class="fx-sub">Later</span>
        </Spot>
      </div>
    ),
    Fixed: () => (
      <div class="fx-screen wide fx-dash">
        <div class="fx-row spread">
          <div class="fx-h">Overview</div>
          <span class="fx-sub">Last 7 days</span>
        </div>
        <Fix f="pareto" style="margin-top:12px">
          <div class="fx-kpis big">
            {[
              ['Visitors', '48.2k', '▲ 6%', 'up'],
              ['Sign-ups', '1,204', '▲ 12%', 'up'],
              ['Revenue', '$18.4k', '▼ 3%', 'down'],
            ].map(([k, v, d, dir]) => (
              <div>
                <span>{k}</span>
                <b>{v}</b>
                <em class={dir}>{d}</em>
              </div>
            ))}
          </div>
          <div class="fx-sub" style="margin-top:6px">
            <u>See all 12 metrics</u>
          </div>
        </Fix>
        <div class="fx-two" style="margin-top:12px;align-items:start">
          <Fix f="pragnanz">
            <div class="fx-sub" style="margin-bottom:6px">
              Traffic by country
            </div>
            <Bars />
          </Fix>
          <Fix f="region">
            <div class="fx-boxes">
              <div>
                <b>Top pages</b>
                <span>/pricing 4.2k</span>
                <span>/blog/launch 3.1k</span>
                <span>/docs 2.7k</span>
              </div>
              <div>
                <b>Top sources</b>
                <span>google.com 5.4k</span>
                <span>newsletter 2.2k</span>
                <span>x.com 1.1k</span>
              </div>
            </div>
          </Fix>
        </div>
        <Fix f="flow" style="margin-top:12px">
          <Note>No pop-up on top of the work. Ask for a rating later, after a report has been shared.</Note>
        </Fix>
      </div>
    ),
  },
];

export const TOTAL_FLAWS = LEVELS.reduce((n, l) => n + l.flaws.length, 0);
