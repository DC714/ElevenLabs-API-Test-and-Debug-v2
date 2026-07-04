This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

It's a desktop-first web tool that helps ElevenLabs forward-deployed engineers diagnose API errors from pasted logs, free-text descriptions, or screenshots, across 7 locales.

## Anthropic API key

There is no server-side Anthropic key to configure. Each user pastes their own Anthropic API key into the "API Key" button in the app's header; it's stored only in that browser tab's `sessionStorage` (cleared when the tab closes) and sent only to this app's own `/api/diagnose` endpoint, which uses it for that request and never persists it. Get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).

This is unrelated to the `ANTHROPIC_API_KEY` GitHub Actions secret used by `.github/workflows/claude.yml`, which only powers the `@claude` GitHub bot.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, matching ElevenLabs' brand typography.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
