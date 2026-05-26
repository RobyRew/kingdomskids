import { z } from 'astro:content';

// ─────────────────────────────────────────────────────────────────────────
// Schemas for upcoming content categories. No collections registered yet —
// `src/content/` is empty. When you ship the first piece of content:
//
//   1. Create the directory, e.g. `src/content/bible-stories/en/jonah.md`.
//   2. Add the `astro/loaders` glob import + `defineCollection` import at
//      the top of this file.
//   3. Bind the schema to a collection:
//
//        const bibleStories = defineCollection({
//          loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bible-stories' }),
//          schema: bibleStoriesSchema,
//        });
//
//   4. Register it in the `collections` export at the bottom.
//
// Keeping the schemas here (and only here) means content authors get a
// single source of truth for the frontmatter shape, while the build stays
// quiet until there's actual content to load.
// ─────────────────────────────────────────────────────────────────────────

const locale = z.enum(['en', 'es', 'ca', 'ro']);

const ageRange = z.object({
  min: z.number().int().gte(2).lte(18),
  max: z.number().int().gte(2).lte(18),
});

export const bibleStoriesSchema = z.object({
  locale,
  title: z.string(),
  reference: z.string(),
  testament: z.enum(['old', 'new']),
  summary: z.string().min(20).max(280),
  ageRange,
  tags: z.array(z.string()).default([]),
  hero: z.string().optional(),
  audioUrl: z.string().url().optional(),
  order: z.number().int().default(100),
  featured: z.boolean().default(false),
});

export const memoryVersesSchema = z.object({
  locale,
  reference: z.string(),
  text: z.string(),
  theme: z.enum(['faith', 'love', 'hope', 'wisdom', 'praise', 'obedience', 'comfort', 'other']).default('other'),
  ageRange,
  order: z.number().int().default(100),
  featured: z.boolean().default(false),
});

export const songsSchema = z.object({
  locale,
  title: z.string(),
  artist: z.string().optional(),
  youtubeUrl: z.string().url().optional(),
  spotifyUrl: z.string().url().optional(),
  bandcampUrl: z.string().url().optional(),
  lyricsAvailable: z.boolean().default(false),
  chordsAvailable: z.boolean().default(false),
  ageRange,
  tags: z.array(z.string()).default([]),
  order: z.number().int().default(100),
  featured: z.boolean().default(false),
});

export const lessonsSchema = z.object({
  locale,
  title: z.string(),
  summary: z.string().min(20).max(280),
  durationMinutes: z.number().int().positive(),
  objectives: z.array(z.string()).min(1),
  materials: z.array(z.string()).default([]),
  scriptureRefs: z.array(z.string()).default([]),
  ageRange,
  series: z.string().optional(),
  order: z.number().int().default(100),
  featured: z.boolean().default(false),
});

export const collections = {};
