import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['de', 'en']),
    draft: z.boolean().default(false),
  }),
});

const kurse = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    level: z.enum(['alle', 'anfänger', 'fortgeschritten']),
    duration: z.number(),
    lang: z.enum(['de', 'en']),
    order: z.number(),
    active: z.boolean().default(true),
  }),
});

export const collections = {
  blog,
  kurse,
};
