import { z } from "zod";
import { routing } from "@/i18n/routing";

export const diagnoseRequestSchema = z
  .object({
    locale: z.enum(routing.locales),
    textInput: z.string().max(20_000).optional(),
    images: z
      .array(
        z.object({
          dataUrl: z.string().startsWith("data:image/"),
          filename: z.string().optional(),
        }),
      )
      .max(3)
      .optional(),
  })
  .refine(
    (value) => Boolean(value.textInput?.trim()) || (value.images?.length ?? 0) > 0,
    { message: "Provide at least text input or one image." },
  );

export type DiagnoseRequest = z.infer<typeof diagnoseRequestSchema>;

export const diagnosisResultSchema = z.object({
  diagnosis: z.string().describe("Plain-language explanation of the most likely root cause(s)."),
  confidence: z.enum(["low", "medium", "high"]),
  matchedKbId: z
    .string()
    .nullable()
    .describe("The id of the matched knowledge base entry, or null if this is a novel/unlisted error."),
  severity: z.enum(["low", "medium", "high", "critical"]),
  remediationSteps: z.array(z.string()).describe("Concrete, ordered steps an FDE can hand to the client."),
  relatedDocs: z.array(z.object({ label: z.string(), url: z.string() })),
});

export type DiagnosisResult = z.infer<typeof diagnosisResultSchema>;
