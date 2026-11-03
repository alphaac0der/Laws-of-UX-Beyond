import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// Old Super.site slugs -> new slugs, so existing shared links keep working.
const renamed = {
  'fittss-law': 'fitts-law',
  'law-of-prgnanz': 'law-of-pragnanz',
};
const slugs = [
  'aesthetic-usability-effect', 'doherty-threshold', 'fittss-law', 'hicks-law', 'jakobs-law',
  'millers-law', 'parkinsons-law', 'postels-law', 'teslers-law', 'occams-razor',
  'pareto-principle', 'paradox-of-the-active-user', 'law-of-common-region', 'law-of-proximity',
  'law-of-prgnanz', 'law-of-similarity', 'law-of-uniform-connectedness', 'cognitive-bias',
  'peak-end-rule', 'serial-position-effect', 'von-restorff-effect', 'zeigarnik-effect',
  'goal-gradient-effect', 'selective-attention', 'choice-overload', 'chunking', 'cognitive-load',
  'flow', 'mental-model', 'working-memory',
];
const redirects = Object.fromEntries(
  slugs.map((old) => [`/all-laws/${old}`, `/laws/${renamed[old] ?? old}`]),
);
redirects['/all-laws'] = '/';

export default defineConfig({
  site: 'https://lawsofuxbeyond.vercel.app',
  integrations: [mdx(), preact(), sitemap()],
  redirects,
});
