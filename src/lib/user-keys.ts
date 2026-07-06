import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { decrypt } from "@/lib/crypto";

/** Resolves and decrypts a logged-in user's saved API key for the given provider, if any. */
export async function getUserApiKey(
  userId: string,
  provider: "anthropic" | "elevenlabs",
): Promise<string | null> {
  const [row] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  const encrypted = provider === "anthropic" ? row?.anthropicApiKeyEncrypted : row?.elevenlabsApiKeyEncrypted;
  return encrypted ? decrypt(encrypted) : null;
}
