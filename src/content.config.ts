import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORIES = ['Heuristics', 'Gestalt', 'Biases', 'Cognition'] as const;

const laws = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/laws' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    category: z.enum(CATEGORIES),
    oneLiner: z.string(),
    takeaway: z.string().optional(),
    origin: z
      .object({
        person: z.string(),
        year: z.string(),
        source: z.string().optional(),
        url: z.string().url().optional(),
      })
      .optional(),
    related: z.array(z.string()).default([]),
    complete: z.boolean().default(false),
  }),
});

export const collections = { laws };
