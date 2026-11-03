<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="Laws of UX Beyond logo">
</p>

<h1 align="center">Laws of UX Beyond</h1>

<p align="center">
  The psychology behind good interfaces, explained for beginners.<br>
  30 laws of UX. Each one with a hands-on demo, an everyday analogy, and real examples.
</p>

<p align="center">
  <a href="https://lawsofuxbeyond.vercel.app"><b>Visit the site</b></a> ·
  <a href="CONTRIBUTING.md">Contribute</a> ·
  <a href="https://discord.gg/2CPErXtSFR">Join the community</a>
</p>

---

## Why this exists

[Laws of UX](https://lawsofux.com) by Jon Yablonski is a great collection of design principles, but a one-line definition is hard to really *understand* when you’re starting out. This project expands every law into a short lesson you can feel for yourself:

- **Try it yourself.** An interactive demo for every law: time yourself choosing from 4 vs 24 options, click small targets vs big ones, test your own memory.
- **In plain words.** An everyday analogy, with no jargon.
- **Why it happens.** The psychology behind it, plus a common misunderstanding.
- **Do vs Don’t.** Side-by-side interface examples.
- **Real-world examples.** How products like Google, Netflix and Duolingo use it.
- **How to apply it.** A practical checklist for your next design.
- **Where it comes from.** Who discovered it, when, and a link to the source.

## The 30 laws

| Heuristics | Gestalt | Biases | Cognition |
| --- | --- | --- | --- |
| Aesthetic-Usability Effect | Law of Common Region | Cognitive Bias | Choice Overload |
| Doherty Threshold | Law of Proximity | Peak-End Rule | Chunking |
| Fitts’s Law | Law of Prägnanz | Serial Position Effect | Cognitive Load |
| Hick’s Law | Law of Similarity | Von Restorff Effect | Flow |
| Jakob’s Law | Law of Uniform Connectedness | Zeigarnik Effect | Mental Model |
| Miller’s Law | | Goal-Gradient Effect | Working Memory |
| Parkinson’s Law | | Selective Attention | |
| Postel’s Law | | | |
| Tesler’s Law | | | |
| Occam’s Razor | | | |
| Pareto Principle | | | |
| Paradox of the Active User | | | |

## Run it locally

Requires [Node.js](https://nodejs.org) 20 or newer.

```sh
git clone https://github.com/alphaac0der/Laws-of-UX---Beyond.git
cd Laws-of-UX---Beyond
npm install
npm run dev        # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with live reload |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |

## Built with

- [Astro](https://astro.build) for the static site and content collections
- [MDX](https://mdxjs.com) for the lessons
- [Preact](https://preactjs.com) for the interactive demos
- Hand-written CSS with design tokens, and light and dark themes

No tracking and no cookies. The only external requests are Google Fonts.

## Deploy

The site is fully static. On [Vercel](https://vercel.com) or [Netlify](https://netlify.com), import the repository and use the defaults: build command `npm run build`, output directory `dist`.

Before deploying under your own domain, update `url` in `src/site.ts`, `site` in `astro.config.mjs` and the sitemap line in `public/robots.txt`.

Old links from the original Notion/Super site (`/all-laws/...`) redirect to the new pages automatically.

## Contributing

Spotted a mistake, have a better example, or want to improve a demo? Contributions are very welcome. Start with the [contributing guide](CONTRIBUTING.md).

## Credits

- Created by [Irtiza Khan Labib](https://irtizakhanlabib.vercel.app/)
- Based on [Laws of UX](https://lawsofux.com) by Jon Yablonski
- Each lesson links to the original research behind the law

## License

[MIT](LICENSE) © Irtiza Khan Labib
