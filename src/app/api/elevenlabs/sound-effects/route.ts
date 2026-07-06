import { ELEVENLABS_API_BASE, getApiKeyOrError, relayBinary } from "@/lib/elevenlabs/proxy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const result = await getApiKeyOrError();
  if ("error" in result) return result.error;

  const body = await request.json();
  const response = await fetch(`${ELEVENLABS_API_BASE}/v1/sound-generation`, {
    method: "POST",
    headers: { "xi-api-key": result.apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return relayBinary(response);
}
