# tomjallen.me

Source for [tomjallen.me](https://tomjallen.me), the personal site of Tom J Allen, a Sydney-based AI platform and product leader.

**Order from chaos, done beautifully.**

## About the site

A single-page site built around an interactive orrery: five orbits for product, AI platforms, build, play and endurance, circling the TJA mark. Each orbit links to its section of the page. The design language, "Celestial Schematic", pairs orrery and technical-diagram motifs with a Swiss/Bauhaus grid and a six-colour palette.

- Light and dark themes, following the system setting with a manual toggle
- Orchestrated load animation and live orbits, with reduced-motion respected
- Accessible: keyboard-navigable orrery, visible focus states, semantic structure
- SEO and AI-search ready: structured `Person` data, sitemap, robots and social preview card

## Stack

- [Next.js](https://nextjs.org) (App Router), exported as static HTML
- TypeScript and plain CSS with design tokens
- [Jost](https://fonts.google.com/specimen/Jost) and IBM Plex Mono, self-hosted via Fontsource
- Hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) static assets
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/): cookieless, no personal data collected

## Project structure

```
app/
  layout.tsx       Metadata, structured data, theme and analytics scripts
  page.tsx         Page content and sections
  globals.css      Design tokens, layout and animation
  sitemap.ts       Sitemap
  robots.ts        Robots rules
  icon.svg         Favicon
components/
  Orrery.tsx       The hero orrery
  ThemeToggle.tsx  Light/dark switch
  BuildIcons.tsx   Project card icons
public/
  og.png           Social preview image
wrangler.jsonc     Cloudflare deployment config
```

## Running locally

```bash
npm install
npm run dev
```

Then open [localhost:3000](http://localhost:3000).

## Building and deploying

```bash
npm run build
```

This outputs a static site to `out/`. Every push to `main` is built and deployed automatically by Cloudflare (`npm run build`, then `npx wrangler deploy`).

## Contact

[hello@tomjallen.me](mailto:hello@tomjallen.me) · [LinkedIn](https://linkedin.com/in/tom-j-allen)
