interface AudioOutputMessage {
  audio?: string | null;
  isFinal?: boolean;
}

export interface GenerateTtsStreamOptions {
  voiceId: string;
  apiKey: string;
  text: string;
  modelId?: string;
  onAudioChunk: (base64Audio: string) => void;
  onDone: () => void;
  onError: (error: unknown) => void;
}

/**
 * Connects directly to ElevenLabs' low-latency TTS WebSocket from the browser using the FDE's
 * own key (per their explicit choice to accept the devtools-visibility tradeoff for lower latency).
 * Docs only document `authorization`/`single_use_token` as valid connection query params — not
 * `xi-api-key`, since browsers can't set custom WebSocket headers — so the raw key is sent both as
 * the `authorization` query param and in the first message body, hedging across what ElevenLabs'
 * docs describe for browser-side auth on this endpoint.
 */
export function generateTtsStream(options: GenerateTtsStreamOptions): () => void {
  const { voiceId, apiKey, text, modelId = "eleven_multilingual_v2", onAudioChunk, onDone, onError } = options;

  const url = new URL(`wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input`);
  url.searchParams.set("model_id", modelId);
  url.searchParams.set("output_format", "mp3_44100_128");
  url.searchParams.set("authorization", apiKey);

  const socket = new WebSocket(url.toString());
  let finished = false;

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        text: " ",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        xi_api_key: apiKey,
      }),
    );
    socket.send(JSON.stringify({ text, try_trigger_generation: true }));
    socket.send(JSON.stringify({ text: "" }));
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data as string) as AudioOutputMessage;
      if (data.audio) onAudioChunk(data.audio);
      if (data.isFinal) {
        finished = true;
        onDone();
        socket.close();
      }
    } catch (error) {
      onError(error);
    }
  };

  socket.onerror = () => {
    onError(new Error("WebSocket connection error"));
  };

  socket.onclose = (event) => {
    if (!finished && !event.wasClean) {
      onError(new Error(`Connection closed unexpectedly (code ${event.code}). Check your ElevenLabs API key.`));
    }
  };

  return () => socket.close();
}

/** Decodes and concatenates base64 audio chunks into a single playable Blob (mp3). */
export function base64ChunksToBlob(chunks: string[]): Blob {
  const byteArrays = chunks.map((chunk) => {
    const binary = atob(chunk);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  });
  return new Blob(byteArrays, { type: "audio/mpeg" });
}
