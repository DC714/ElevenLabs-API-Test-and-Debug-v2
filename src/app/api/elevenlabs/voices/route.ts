import { ELEVENLABS_API_BASE, getApiKeyOrError, relayJson } from "@/lib/elevenlabs/proxy";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const result = getApiKeyOrError(request);
  if ("error" in result) return result.error;

  const response = await fetch(`${ELEVENLABS_API_BASE}/v1/voices`, {
    headers: { "xi-api-key": result.apiKey },
  });

  return relayJson(response);
}
