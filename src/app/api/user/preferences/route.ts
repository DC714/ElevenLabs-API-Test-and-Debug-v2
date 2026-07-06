import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { encrypt } from "@/lib/crypto";
import { getCurrentSession } from "@/lib/session";
import { routing } from "@/i18n/routing";

const patchSchema = z.object({
  locale: z.enum(routing.locales).optional(),
  anthropicApiKey: z.string().min(1).nullable().optional(),
  elevenlabsApiKey: z.string().min(1).nullable().optional(),
});

function toStatus(row: { locale: string; anthropicApiKeyEncrypted: string | null; elevenlabsApiKeyEncrypted: string | null } | undefined) {
  return {
    locale: row?.locale ?? routing.defaultLocale,
    hasAnthropicKey: Boolean(row?.anthropicApiKeyEncrypted),
    hasElevenLabsKey: Boolean(row?.elevenlabsApiKeyEncrypted),
  };
}

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

  return NextResponse.json(toStatus(row));
}

export async function PATCH(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  const { locale, anthropicApiKey, elevenlabsApiKey } = parsed.data;

  const values: {
    userId: string;
    locale?: string;
    anthropicApiKeyEncrypted?: string | null;
    elevenlabsApiKeyEncrypted?: string | null;
    updatedAt: Date;
  } = { userId: session.user.id, updatedAt: new Date() };

  if (locale !== undefined) values.locale = locale;
  if (anthropicApiKey !== undefined) {
    values.anthropicApiKeyEncrypted = anthropicApiKey === null ? null : encrypt(anthropicApiKey);
  }
  if (elevenlabsApiKey !== undefined) {
    values.elevenlabsApiKeyEncrypted = elevenlabsApiKey === null ? null : encrypt(elevenlabsApiKey);
  }

  await db
    .insert(userPreferences)
    .values({
      userId: session.user.id,
      locale: locale ?? routing.defaultLocale,
      anthropicApiKeyEncrypted: values.anthropicApiKeyEncrypted,
      elevenlabsApiKeyEncrypted: values.elevenlabsApiKeyEncrypted,
    })
    .onConflictDoUpdate({ target: userPreferences.userId, set: values });

  const [row] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  return NextResponse.json(toStatus(row));
}
