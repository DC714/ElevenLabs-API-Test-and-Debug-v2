# ElevenLabs API Diagnostics

A desktop-first web app for ElevenLabs forward-deployed engineers (FDEs). It has two purposes:

1. **Diagnose** — paste an error log, describe an issue, or upload a screenshot, and get an AI-powered diagnosis (root cause, remediation steps, related docs) backed by a curated ElevenLabs error knowledge base.
2. **Demo** — run live, interactive demos of every major ElevenLabs API (Text-to-Speech, Speech-to-Text, Voices/cloning, Conversational AI, Dubbing, Sound Effects) in front of clients and prospects.

The app is available in 7 languages: English (US), Polish, Spanish, Brazilian Portuguese, Portugal Portuguese, Greek, and Dutch.

## Authentication and data storage

Sign-in is required to use the app — email/password, Google, or GitHub. Accounts, sessions, language preference, and API keys are stored in a Neon Postgres database, using [Better Auth](https://www.better-auth.com/) for authentication and [Drizzle ORM](https://orm.drizzle.team/) for the database layer.

Each user adds their own **Anthropic** API key (used for Diagnose) and **ElevenLabs** API key (used for the Demo suite) once, from the Settings dialog in the app header. Keys are encrypted at rest (AES-256-GCM) and are never sent back to the browser — server routes decrypt the caller's own key on demand using their session. The one exception is the Text-to-Speech demo, which opens a WebSocket directly from the browser to ElevenLabs for lower latency; that route has a narrow, explicitly-scoped endpoint that reveals the raw key to the browser only for that connection.

Get an Anthropic key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) and an ElevenLabs key at the [ElevenLabs dashboard](https://elevenlabs.io/app/settings/api-keys).

This is unrelated to the `ANTHROPIC_API_KEY` GitHub Actions secret used by `.github/workflows/claude.yml`, which only powers the `@claude` GitHub bot.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create `.env.local` in the project root:

```bash
# Neon Postgres connection string (from your Neon project's Connection Details)
DATABASE_URL=

# Better Auth
BETTER_AUTH_SECRET=   # generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

# Encrypts stored Anthropic/ElevenLabs API keys at rest (32-byte hex key)
API_KEY_ENCRYPTION_KEY=   # generate with: openssl rand -hex 32

# Google OAuth (console.cloud.google.com) - leave blank to disable Google sign-in
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth (github.com/settings/developers) - leave blank to disable GitHub sign-in
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Email/password sign-in works with just the first three variables set. Google/GitHub sign-in are optional — each one only appears in the UI once its client ID/secret pair is set.

For OAuth redirect URIs, use `{BETTER_AUTH_URL}/api/auth/callback/google` and `{BETTER_AUTH_URL}/api/auth/callback/github`.

### 3. Run database migrations

```bash
npm run db:generate   # generate a SQL migration from src/db/schema.ts
npm run db:migrate    # apply migrations to DATABASE_URL
npm run db:studio     # optional: browse the database in Drizzle Studio
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to sign in or register before you can use the app.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **next-intl** for i18n routing across 7 locales
- **Better Auth** for authentication (email/password, Google, GitHub)
- **Drizzle ORM** + **Neon Postgres** (`@neondatabase/serverless`, HTTP driver)
- **Anthropic SDK** for the diagnosis engine (Claude, with vision support for screenshots)
- **@elevenlabs/react** for the Conversational AI demo
- **Tailwind CSS v4**

## Deployment

Deployed on Vercel. In addition to the environment variables above (with `BETTER_AUTH_URL` set to your production URL), make sure to run `npm run db:migrate` against your production database before the first deploy that needs the new schema.
