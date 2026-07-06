import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { ImageBlockParam, TextBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { getAnthropicClient } from "./client";
import { buildLocaleDirectiveBlock, buildStaticSystemBlock } from "./prompt";
import { diagnosisResultSchema, type DiagnoseRequest } from "@/types/diagnosis";

const SUPPORTED_IMAGE_MEDIA_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

function parseDataUrl(dataUrl: string): { mediaType: string; data: string } {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Image must be a base64-encoded data URL");
  }
  const [, mediaType, data] = match;
  if (!SUPPORTED_IMAGE_MEDIA_TYPES.has(mediaType)) {
    throw new Error(`Unsupported image type: ${mediaType}`);
  }
  return { mediaType, data };
}

export function runDiagnosis(request: DiagnoseRequest, apiKey: string) {
  const content: Array<ImageBlockParam | TextBlockParam> = [];

  for (const image of request.images ?? []) {
    const { mediaType, data } = parseDataUrl(image.dataUrl);
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data,
      },
    });
  }

  if (request.textInput) {
    content.push({ type: "text", text: request.textInput });
  }

  const client = getAnthropicClient(apiKey);

  return client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    system: [buildStaticSystemBlock(), buildLocaleDirectiveBlock(request.locale)],
    messages: [{ role: "user", content }],
    output_config: {
      format: zodOutputFormat(diagnosisResultSchema),
    },
  });
}
