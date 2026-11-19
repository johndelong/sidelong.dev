import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// One markdown file per app in src/content/apps. The body is the story behind it.
const apps = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    summary: z.string(), // one or two lines, shown on the home page
    tagline: z.string(), // the big line on the app's own page
    gradient: z.string(), // CSS colour stops for the icon tile
    glyph: z.string().optional(), // SVG shapes on a 48-unit grid, used until a real icon exists
    icon: z.string().optional(), // path to a real icon image in /public
    chips: z.array(z.string()).default([]),
    link: z.object({ label: z.string(), href: z.string() }).optional(),
    screenshot: z.string().optional(), // hero screenshot path in /public
    screenshotAlt: z.string().default(''),
    goalsTitle: z.string().optional(),
    goals: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    features: z
      .array(z.object({ title: z.string(), body: z.string(), screenshot: z.string().optional(), alt: z.string().default('') }))
      .default([]),
  }),
})

export const collections = { apps }
