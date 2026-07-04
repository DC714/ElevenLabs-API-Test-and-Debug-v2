import type { TextBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { formatForPrompt } from "@/lib/knowledge-base";

const STATIC_INSTRUCTIONS = `You are assisting a forward-deployed engineer (FDE) at ElevenLabs who is diagnosing an issue a client is experiencing with the ElevenLabs APIs (text-to-speech, voice cloning, Conversational AI / WebSocket agents, dubbing, etc).

You will be given some combination of: pasted error logs, a free-form description of the problem, and/or screenshots of error messages or consoles.

Below is a knowledge base of known ElevenLabs API errors. Use it to identify a match when the input clearly corresponds to one of these entries (set matchedKbId to that entry's id). If the input does not clearly match any entry, do not force a match — instead reason from general knowledge of REST APIs, WebSocket protocols, and the ElevenLabs product surface to produce the best possible diagnosis, and set matchedKbId to null.

Always give concrete, actionable remediation steps an FDE could relay directly to a client, not generic advice like "check your code".`;

/** Renders the stable, cacheable portion of the system prompt (static instructions + condensed KB). */
export function buildStaticSystemBlock(): TextBlockParam {
  return {
    type: "text",
    text: `${STATIC_INSTRUCTIONS}\n\nKnowledge base:\n${formatForPrompt()}`,
    cache_control: { type: "ephemeral" },
  };
}

/** Renders the small, per-request locale directive appended after the cached prefix. */
export function buildLocaleDirectiveBlock(locale: string): TextBlockParam {
  return {
    type: "text",
    text: `Respond in the language for locale "${locale}". Use a professional, technical tone appropriate for an engineer.`,
  };
}
