"use client";

import { ConversationProvider } from "@elevenlabs/react";
import { ConversationalAiDemo } from "@/components/demo/conversational-ai/ConversationalAiDemo";

export default function ConversationalAiPage() {
  return (
    <ConversationProvider>
      <ConversationalAiDemo />
    </ConversationProvider>
  );
}
