import { NextResponse } from "next/server";
import { ELEVENLABS_API_BASE, getApiKeyOrError, relayJson } from "@/lib/elevenlabs/proxy";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const result = await getApiKeyOrError();
  if ("error" in result) return result.error;

  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agentId");
  if (!agentId) {
    return NextResponse.json({ error: "Missing agentId query parameter" }, { status: 400 });
  }

  const response = await fetch(
    `${ELEVENLABS_API_BASE}/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
    { headers: { "xi-api-key": result.apiKey } },
  );

  return relayJson(response);
}
