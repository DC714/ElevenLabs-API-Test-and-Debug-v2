import Anthropic from "@anthropic-ai/sdk";

/** Constructs an Anthropic client scoped to the caller-supplied key (each user brings their own for the session). */
export function getAnthropicClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey });
}
