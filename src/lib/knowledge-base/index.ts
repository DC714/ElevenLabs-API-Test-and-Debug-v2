import type { KBEntry } from "./types";
import { seedEntries } from "./seed/errors";

export type { KBEntry, ErrorCategory, Severity } from "./types";

export const knowledgeBase: KBEntry[] = seedEntries;

export function findByErrorCode(code: string): KBEntry | undefined {
  const normalized = code.trim().toLowerCase();
  return knowledgeBase.find(
    (entry) =>
      entry.errorCode.toLowerCase() === normalized ||
      entry.id.toLowerCase() === normalized,
  );
}

export function searchKeywords(query: string): KBEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return knowledgeBase.filter((entry) =>
    [entry.id, entry.title, entry.errorCode, ...entry.keywords].some((field) =>
      field.toLowerCase().includes(normalized),
    ),
  );
}

/** Renders a condensed, prompt-friendly summary of the knowledge base. */
export function formatForPrompt(entries: KBEntry[] = knowledgeBase): string {
  return entries
    .map((entry) => {
      const status = entry.httpStatus ? `HTTP ${entry.httpStatus}` : "no HTTP status";
      return `- [${entry.id}] "${entry.errorCode}" (${status}, ${entry.category}, severity=${entry.severity}, surface=${entry.surface.join("/")}): ${entry.description} Likely causes: ${entry.likelyCauses.join("; ")}.`;
    })
    .join("\n");
}
