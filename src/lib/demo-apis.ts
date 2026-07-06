export const DEMO_APIS = [
  { slug: "text-to-speech", key: "textToSpeech" },
  { slug: "speech-to-text", key: "speechToText" },
  { slug: "voices", key: "voices" },
  { slug: "conversational-ai", key: "conversationalAi" },
  { slug: "dubbing", key: "dubbing" },
  { slug: "sound-effects", key: "soundEffects" },
] as const;

export type DemoApiSlug = (typeof DEMO_APIS)[number]["slug"];
