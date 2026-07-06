import { ELEVENLABS_API_BASE, getApiKeyOrError, relayJson } from "@/lib/elevenlabs/proxy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const result = await getApiKeyOrError();
  if ("error" in result) return result.error;

  const formData = await request.formData();
  const response = await fetch(`${ELEVENLABS_API_BASE}/v1/voices/add`, {
    method: "POST",
    headers: { "xi-api-key": result.apiKey },
    body: formData,
  });

  return relayJson(response);
}
