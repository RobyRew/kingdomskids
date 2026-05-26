import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ─────────────────────────────────────────────────────────────────────────
// Content collections are DEFINED but not yet REGISTERED — the directories
// hold only `.gitkeep` files and Astro's glob() loader logs a warning every
// build for each empty collection ("No files found matching ...").
//
// When you're ready to publish a category, drop the first matching file
// (e.g. `src/content/bible-stories/en/jonah.md`), then add the collection
// to the `collections` export at the bottom of this file.
//
// The Zod schemas live here unchanged so they document the expected shape
// for content authors and stay in lockstep when the collection re-enters
// the build pipeline.
// ─────────────────────────────────────────────────────────────────────────

const locale = z.enum(['en', 'es', 'ca', 'ro']);

const ageRange = z.object({
  min: z.number().int().gte(2).lte(18),
  max: z.number().int().gte(2).lte(18),
});

// ── Bible stories ───────────────────────────────────────────────────────
export const bibleStoriesSchema = z.object({
  locale,
  title: z.string(),
  reference: z.string(),               // e.g. "John 3:1-21"
  testament: z.enum(['old', 'new']),
  summary: z.string().min(20).max(280),
  ageRange,
  tags: z.array(z.string()).default([]),
  hero: z.string().optional(),
  audioUrl: z.string().url().optional(),
  order: z.number().int().default(100),
  featured: z.boolean().default(false),
});

// ── Memory verses ───────────────────────────────────────────────────────
export const memoryVersesSchema = z.object({
  locale,
  reference: z.string(),               // "Proverbs 22:6"
  text: z.string(),                    // full verse text
  theme: z.enum(['faith', 'love', 'hope', 'wisdom', 'praise', 'obedience', 'comfort', 'other']).default('other'),
  ageRange,
  order: z.number().int().default(100),
  featured: z.boolean().default(false),
});

// ── Songs ───────────────────────────────────────────────────────────────
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

// ── Lessons ─────────────────────────────────────────────────────────────
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

// Re-enable a collection by uncommenting its block + adding it to `collections`.
//
// const bibleStories = defineCollection({
//   loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bible-stories' }),
//   schema: bibleStoriesSchema,
// });
// const memoryVerses = defineCollection({
//   loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/memory-verses' }),
//   schema: memoryVersesSchema,
// });
// const songs = defineCollection({
//   loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/songs' }),
//   schema: songsSchema,
// });
// const lessons = defineCollection({
//   loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
//   schema: lessonsSchema,
// });

export const collections = {
  // 'bible-stories': bibleStories,
  // 'memory-verses': memoryVerses,
  // songs,
  // lessons,
};
