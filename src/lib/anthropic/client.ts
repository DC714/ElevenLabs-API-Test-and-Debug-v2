import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

/** Lazily constructs the Anthropic client so a missing key only fails at request time, not at build time. */
export function getAnthropicClient(): Anthropic {
  if (client) return client;

  const apiKey = process.env.ELEVENLABS_DIAGNOSTIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ELEVENLABS_DIAGNOSTIC_ANTHROPIC_API_KEY is not set. Configure it in .env.local for development or in the Vercel project's environment variables.",
    );
  }

  client = new Anthropic({ apiKey });
  return client;
}
