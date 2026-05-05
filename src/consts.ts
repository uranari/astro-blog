// サイト全体の定数。デプロイ前に書き換える
export const SITE = {
  title: 'uranari',
  description: '旅と写真とtech',
  url: 'https://blog.uranari.com/',
  author: 'uranari',
  lang: 'ja',
  locale: 'ja-JP',
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' },
  { href: '/rss.xml', label: 'RSS' },
] as const;
