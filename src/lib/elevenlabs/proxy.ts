import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getUserApiKey } from "@/lib/user-keys";

export const ELEVENLABS_API_BASE = "https://api.elevenlabs.io";

/** Resolves the logged-in user's saved ElevenLabs key, or a ready-to-return error response if unavailable. */
export async function getApiKeyOrError(): Promise<{ apiKey: string } | { error: NextResponse }> {
  const session = await getCurrentSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }

  const apiKey = await getUserApiKey(session.user.id, "elevenlabs");
  if (!apiKey) {
    return {
      error: NextResponse.json(
        { error: "No ElevenLabs API key saved. Add one in Settings." },
        { status: 400 },
      ),
    };
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
