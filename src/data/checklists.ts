import type { CollectionEntry } from 'astro:content';
import { PATTERNS } from './patterns';

/**
 * Reads the "How to apply it" items straight out of a lesson's MDX source,
 * so the lesson file stays the single source of truth.
 * Returns each item as HTML (only **bold** is supported).
 */
export function getChecklist(law: CollectionEntry<'laws'>): string[] {
  const block = law.body?.match(/<Checklist>([\s\S]*?)<\/Checklist>/)?.[1] ?? '';
  return block
    .split(/\r?\n/)
    .filter((line) => line.startsWith('- '))
    .map((line) =>
      line
        .slice(2)
        .trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
    );
}

/** Fails the build if a pattern points at a law that doesn't exist. */
export function assertPatternSlugs(laws: CollectionEntry<'laws'>[]) {
  const ids = new Set(laws.map((l) => l.id));
  for (const p of PATTERNS)
    for (const { slug } of p.laws)
      if (!ids.has(slug)) throw new Error(`patterns.ts: "${p.id}" lists unknown law "${slug}"`);
}
