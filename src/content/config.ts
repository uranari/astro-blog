import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      category: z.string().optional(),
      legacyUrl: z.string().optional(),
      // 画像はsrc/content/posts/_images/などに置けば最適化される
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
