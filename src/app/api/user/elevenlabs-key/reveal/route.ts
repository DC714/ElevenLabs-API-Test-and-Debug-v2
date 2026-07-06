import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { decrypt } from "@/lib/crypto";
import { getCurrentSession } from "@/lib/session";

/**
 * Returns the caller's own decrypted ElevenLabs key. Used only by the Text-to-Speech demo,
 * which (per an explicit product decision) connects directly from the browser to ElevenLabs'
 * WebSocket and therefore needs the raw key client-side for that one connection. Every other
 * ElevenLabs/Anthropic call resolves the key server-side and never exposes it to the client.
 */
export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [row] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  if (!row?.elevenlabsApiKeyEncrypted) {
    return NextResponse.json({ error: "No ElevenLabs API key saved" }, { status: 404 });
  }

  return NextResponse.json({ apiKey: decrypt(row.elevenlabsApiKeyEncrypted) });
}
