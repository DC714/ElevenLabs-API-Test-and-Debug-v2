import { elevenLabsKeySession } from "@/lib/api-key-session";

/** Headers for calling our own /api/elevenlabs/* proxy routes, carrying the FDE's session-scoped ElevenLabs key. */
export function elevenLabsHeaders(extra?: HeadersInit): HeadersInit {
  return { "x-elevenlabs-key": elevenLabsKeySession.read() ?? "", ...extra };
}
