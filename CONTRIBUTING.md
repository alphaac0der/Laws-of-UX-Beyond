# Contributing to Laws of UX Beyond

Thanks for helping make UX psychology easier to learn. Every improvement counts, from fixing a typo to building a new demo.

## Ways to help

- **Fix or improve a lesson.** Clearer wording, a better analogy, a more accurate example, a fixed source link.
- **Report a problem.** Something broken, confusing, inaccessible or factually wrong? [Open an issue](../../issues/new/choose).
- **Improve a demo.** Make it clearer, more fun, more accessible or better on mobile.
- **Translate.** Not set up yet. Open an issue if you'd like to lead a translation.

If you're planning a big change (a new demo, a redesign of a section), open an issue first so we can agree on the direction before you spend time on it.

## Run it locally

You need [Node.js](https://nodejs.org) 20 or newer.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # must pass before you open a pull request
```

## How the project is organised

| What | Where |
| --- | --- |
| Lesson content, one file per law | `src/content/laws/*.mdx` |
| Lesson fields (title, category, origin…) | `src/content.config.ts` |
| Interactive demos (Preact) | `src/components/demos/*.tsx` |
| Shared demo helpers (intro screen, results bars, buttons) | `src/components/demos/shared.tsx` |
| Lesson building blocks | `src/components/` (`Section`, `Analogy`, `DoDont`, `Checklist`, `DemoFrame`) |
| Per-law diagrams | `src/components/LawDiagram.astro` |
| Design tokens, layout and page styles | `src/styles/global.css` |
| Demo styles | `src/styles/demos.css` |
| Site name, links and credits | `src/site.ts` |

## Writing a lesson

Every lesson follows the same structure, so readers always know where to look. Use `src/content/laws/hicks-law.mdx` as the reference.

1. **Try it yourself:** a demo inside `<DemoFrame>`.
2. **In plain words:** an everyday analogy inside `<Analogy>`, then one or two sentences.
3. **Why it happens:** the psychology, plus one `.callout` with a common mistake or nuance.
4. **Do vs Don’t:** one `<DoDont>` with two small mock screens built from the `.ui-*` classes.
5. **Real-world examples:** three or four real products. Say *what* they do and *why* it works.
6. **How to apply it:** a `<Checklist>` of four or five concrete actions.

The frontmatter also needs a `takeaway`, an `origin` (who, when, source and link) and `related` laws. These render automatically.

### Writing style

- **Write for a beginner.** Short sentences, plain words, no jargon without explanation.
- **Be specific.** “Google’s homepage has one search box” beats “some sites are simple.”
- **Be accurate.** Link to the original study, or a reputable summary (Wikipedia, Nielsen Norman Group), for every origin. Don’t invent statistics.
- **Use American English** and curly quotes (’ “ ”) to match the existing lessons.

## Building a demo

- Put it in `src/components/demos/YourDemo.tsx` and use the helpers in `shared.tsx` (`Intro`, `Results`, `Toggle`, `PRIMARY`, `GHOST`).
- Keep it under a minute to play, and make it work with **keyboard only** and on a **375px-wide phone**.
- Use the design tokens (`var(--text)`, `var(--accent)`…) so it works in light and dark mode.
- Write numeric inline styles as strings with units (`` `${x}px` ``). Preact 11 doesn’t add `px` automatically.
- End with a short, honest verdict that connects the result to the law, including when the user beats the effect.

## Before you open a pull request

- [ ] `npm run build` passes
- [ ] You checked your change in light **and** dark mode
- [ ] You checked it at phone width (about 375px)
- [ ] New facts have a source

By contributing, you agree that your contributions are licensed under the project’s [MIT License](LICENSE), and you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
