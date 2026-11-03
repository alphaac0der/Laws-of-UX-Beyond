/**
 * Common screens and components, mapped to the laws that matter most when designing them.
 * Beginners think in screens ("I'm designing a sign-up form"), not in law names.
 * Each `why` is specific to the pattern, not a repeat of the law's one-liner.
 */
export type Pattern = {
  id: string;
  title: string;
  blurb: string;
  laws: { slug: string; why: string }[];
};

export const PATTERNS: Pattern[] = [
  {
    id: 'forms',
    title: 'Forms & sign-up',
    blurb: 'Every field is a small cost. Make each one easy to understand, fill in and fix.',
    laws: [
      { slug: 'occams-razor', why: 'Every field you remove is one less reason to give up. Ask only for what you need right now.' },
      { slug: 'law-of-proximity', why: 'Labels that sit closer to their own field than to the next one stop people typing in the wrong box.' },
      { slug: 'postels-law', why: 'Accept phone numbers, dates and names the way people naturally type them, then clean them up yourself.' },
      { slug: 'chunking', why: 'Long numbers like cards and IBANs are far easier to type and check in small groups.' },
      { slug: 'fitts-law', why: 'A big submit button right under the last field means nobody has to hunt or aim for it.' },
      { slug: 'goal-gradient-effect', why: 'On multi-step forms, visible progress keeps people going when they’re tempted to quit.' },
      { slug: 'parkinsons-law', why: 'Autofill and smart defaults make a form take seconds, not the minutes people expect.' },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation & menus',
    blurb: 'People should know where they are, where they can go, and how to get back.',
    laws: [
      { slug: 'jakobs-law', why: 'People expect the logo top-left, the menu across the top or bottom, and the account top-right.' },
      { slug: 'hicks-law', why: 'Every extra menu item makes every visit a little slower. Group and trim the top level.' },
      { slug: 'serial-position-effect', why: 'The first and last menu items get noticed and remembered most, so put key destinations there.' },
      { slug: 'law-of-similarity', why: 'Every nav item should look alike, and different from buttons and plain text.' },
      { slug: 'millers-law', why: 'Keep each menu level short and grouped so people can scan it without losing track.' },
      { slug: 'mental-model', why: 'Name sections after what users want to do, not after your company’s org chart.' },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing & plans',
    blurb: 'Help people pick the right plan quickly, and feel good about it afterwards.',
    laws: [
      { slug: 'hicks-law', why: 'Three plans with one recommended beats eight plans with no clear winner.' },
      { slug: 'choice-overload', why: 'Too many tiers and add-ons make people put off the decision, or skip it entirely.' },
      { slug: 'von-restorff-effect', why: 'Highlight the plan you recommend so it answers “which one is for me?” at a glance.' },
      { slug: 'working-memory', why: 'Show plans side by side so people can compare without remembering details from another page.' },
      { slug: 'law-of-common-region', why: 'A card per plan makes it obvious which price, features and button belong together.' },
      { slug: 'cognitive-bias', why: 'Anchoring and defaults are powerful here. Use them to help people decide, never to trick them.' },
    ],
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    blurb: 'The first few minutes decide whether people stay. Get them doing something useful fast.',
    laws: [
      { slug: 'paradox-of-the-active-user', why: 'People skip tours and manuals. Teach with small hints at the moment a feature is used.' },
      { slug: 'goal-gradient-effect', why: 'A setup progress bar that starts partly filled makes finishing feel close.' },
      { slug: 'zeigarnik-effect', why: 'A visible checklist of what’s left gives people a reason to come back and finish setup.' },
      { slug: 'occams-razor', why: 'Ask for the minimum to get started. Everything else can wait until it’s needed.' },
      { slug: 'peak-end-rule', why: 'End the first session on a clear win, like a finished first project, not on a settings screen.' },
      { slug: 'flow', why: 'Start easy and ramp up, so new users feel capable instead of lost.' },
    ],
  },
  {
    id: 'buttons',
    title: 'Buttons & calls to action',
    blurb: 'Make the main action obvious, easy to hit and clearly different from everything else.',
    laws: [
      { slug: 'fitts-law', why: 'Important buttons should be big and close to where the user’s pointer or thumb already is.' },
      { slug: 'von-restorff-effect', why: 'Make one primary action stand out per screen. If everything is bold, nothing is.' },
      { slug: 'law-of-similarity', why: 'Buttons that do similar things should look alike, and links should look different from buttons.' },
      { slug: 'jakobs-law', why: 'Follow the button order people know from their platform, and keep Cancel as a quiet secondary action.' },
      { slug: 'selective-attention', why: 'A button styled like an ad or banner gets ignored. Keep actions where people are working.' },
    ],
  },
  {
    id: 'search-lists',
    title: 'Search & long lists',
    blurb: 'Help people find the one thing they want in a sea of options.',
    laws: [
      { slug: 'choice-overload', why: 'Show a short, curated set first, with filters to narrow the rest.' },
      { slug: 'hicks-law', why: 'Group long lists into categories so people choose in a few small steps, not one giant one.' },
      { slug: 'serial-position-effect', why: 'People look at the top results most, so rank the best matches first.' },
      { slug: 'postels-law', why: 'Forgive typos, plurals and synonyms so a search for “shoe” finds “Shoes”.' },
      { slug: 'law-of-proximity', why: 'Consistent spacing within and between results helps people scan without mixing items up.' },
      { slug: 'chunking', why: 'Section headers and dividers turn a long list into groups people can scan.' },
    ],
  },
  {
    id: 'feedback',
    title: 'Loading & feedback',
    blurb: 'Every action needs a response, and waiting should never feel like being ignored.',
    laws: [
      { slug: 'doherty-threshold', why: 'Respond within about 400 ms. If the real work takes longer, show something right away.' },
      { slug: 'goal-gradient-effect', why: 'A progress bar that moves makes a long wait feel shorter and worth sticking out.' },
      { slug: 'peak-end-rule', why: 'A clear, friendly success message is the moment people remember the task by.' },
      { slug: 'selective-attention', why: 'Show errors and confirmations next to what the user just did, not in a distant banner.' },
      { slug: 'flow', why: 'Quiet, instant feedback (like autosave) keeps people focused instead of breaking their concentration.' },
    ],
  },
  {
    id: 'checkout',
    title: 'Checkout',
    blurb: 'The last few steps before money changes hands. Remove every reason to hesitate.',
    laws: [
      { slug: 'teslers-law', why: 'Work out tax, shipping and totals for the user. Show one final price before they pay.' },
      { slug: 'law-of-uniform-connectedness', why: 'Steps joined by a line show exactly where people are and how much is left.' },
      { slug: 'parkinsons-law', why: 'Saved addresses and cards turn checkout into one confirming tap.' },
      { slug: 'aesthetic-usability-effect', why: 'A tidy, consistent checkout feels trustworthy, which matters when people are typing card details.' },
      { slug: 'peak-end-rule', why: 'The confirmation page is the ending people remember. Say clearly what happens next.' },
      { slug: 'cognitive-bias', why: 'Pre-ticked extras and hidden fees can lift one sale and lose the customer for good.' },
    ],
  },
  {
    id: 'dashboards',
    title: 'Dashboards & data',
    blurb: 'Lots of information on one screen. Show what matters first and let the rest wait.',
    laws: [
      { slug: 'pareto-principle', why: 'A few numbers drive most decisions. Put those up front and move the rest a click away.' },
      { slug: 'cognitive-load', why: 'Every chart and label costs attention. Remove anything that doesn’t help a decision.' },
      { slug: 'law-of-common-region', why: 'Cards or panels show which numbers and charts belong together.' },
      { slug: 'working-memory', why: 'Put the numbers people compare next to each other, instead of on separate tabs.' },
      { slug: 'chunking', why: 'Format big numbers (1.2M, 34,512) so they can be read at a glance.' },
      { slug: 'von-restorff-effect', why: 'Use your accent color only for what needs attention, like an alert or an outlier.' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile & touch',
    blurb: 'Small screens, big thumbs and lots of distractions. Design for one hand and half the attention.',
    laws: [
      { slug: 'fitts-law', why: 'Touch targets need to be at least 44–48 px and within easy reach of the thumb.' },
      { slug: 'jakobs-law', why: 'Follow platform patterns like the bottom tab bar, swipe back and pull to refresh.' },
      { slug: 'serial-position-effect', why: 'In a bottom tab bar, the first and last tabs are the most noticed and remembered.' },
      { slug: 'pareto-principle', why: 'Small screens can only fit the vital few actions. Put the rest under “More”.' },
      { slug: 'cognitive-load', why: 'People use phones on the move with half their attention. One clear task per screen.' },
      { slug: 'doherty-threshold', why: 'Mobile networks are slow and unreliable, so show instant feedback and update optimistically.' },
    ],
  },
];

/** Patterns that list a given law, for "Shows up in" links on lesson pages. */
export const patternsForLaw = (slug: string) => PATTERNS.filter((p) => p.laws.some((l) => l.slug === slug));
