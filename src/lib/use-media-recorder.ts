"use client";

import { useCallback, useRef, useState } from "react";

export type RecorderStatus = "idle" | "recording" | "stopped";

/** Wraps MediaRecorder for a simple record-a-clip-then-get-a-blob flow, shared by STT and voice cloning demos. */
export function useMediaRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        setBlob(new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }));
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setBlob(null);
      setStatus("recording");
    } catch {
      setError("mic_denied");
    }
  }, []);

  const stop = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setStatus("stopped");
  }, []);

  const reset = useCallback(() => {
    setBlob(null);
    setStatus("idle");
  }, []);

  return { status, blob, error, start, stop, reset };
}
