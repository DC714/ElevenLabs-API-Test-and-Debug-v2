import { NextResponse } from "next/server";

export const ELEVENLABS_API_BASE = "https://api.elevenlabs.io";

/** Extracts the FDE's ElevenLabs key from the request header, or a ready-to-return 401 if missing. */
export function getApiKeyOrError(request: Request): { apiKey: string } | { error: NextResponse } {
  const apiKey = request.headers.get("x-elevenlabs-key");
  if (!apiKey) {
    return { error: NextResponse.json({ error: "Missing x-elevenlabs-key header" }, { status: 401 }) };
  }
  return { apiKey };
}

/** Relays a binary (audio) response from ElevenLabs back to the client, or a clean JSON error. */
export async function relayBinary(response: Response): Promise<Response> {
  if (!response.ok) {
    const errorBody = await response.text();
    return new Response(errorBody, { status: response.status });
  }
  return new Response(response.body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/octet-stream" },
  });
}

/** Relays a JSON response from ElevenLabs back to the client, preserving status. */
export async function relayJson(response: Response): Promise<NextResponse> {
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
