import type { APIContext } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { html as toReactNode } from 'satori-html';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE } from '../../consts';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

interface Props {
  post: CollectionEntry<'posts'>;
}

// fontCache: ビルド中の全ページで使い回す
let _fontCache: Promise<Awaited<ReturnType<typeof loadFonts>>> | null = null;
async function loadFonts() {
  const japaneseFont = await readFile('/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf');
  const latinFont = await readFile('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf');

  return [
    {
      name: 'Droid Sans Fallback',
      data: japaneseFont,
      weight: 700 as const,
      style: 'normal' as const,
    },
    {
      name: 'DejaVu Sans',
      data: latinFont,
      weight: 500 as const,
      style: 'normal' as const,
    },
  ];
}
function getFonts() {
  if (!_fontCache) _fontCache = loadFonts();
  return _fontCache;
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET({ props }: APIContext<Record<string, any>, Props>) {
  const { post } = props;
  const fonts = await getFonts();

  const markup = toReactNode(`
    <div style="height: 100%; width: 100%; display: flex; flex-direction: column; padding: 70px 80px; background: #faf7f2; color: #1a1814; font-family: 'DejaVu Sans';">
      <div style="font-size: 22px; color: #8b1e1e; letter-spacing: 6px; text-transform: uppercase; font-weight: 500;">
        ${escape(SITE.title)}
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <div style="font-family: 'Droid Sans Fallback'; font-size: 60px; line-height: 1.25; font-weight: 700; letter-spacing: -0.01em; color: #1a1814;">
          ${escape(post.data.title)}
        </div>
        <div style="font-size: 24px; color: #5a564d; margin-top: 24px; line-height: 1.5;">
          ${escape(post.data.description)}
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 20px; color: #5a564d;">
        <div>${post.data.pubDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div>${escape(SITE.author)}</div>
      </div>
    </div>
  `);

  const svg = await satori(markup as any, {
    width: 1200,
    height: 630,
    fonts: fonts as any,
  });

  const png = new Resvg(svg).render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
