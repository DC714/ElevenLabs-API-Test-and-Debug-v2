export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
  preview_url?: string | null;
  labels?: Record<string, string>;
}

export interface SpeechToTextWord {
  text: string;
  start: number;
  end: number;
  type?: string;
  speaker_id?: string;
}

export interface SpeechToTextResult {
  text: string;
  language_code?: string;
  language_probability?: number;
  words?: SpeechToTextWord[];
  audio_duration_secs?: number;
}

export type DubbingStatus = "queued" | "preparing" | "dubbing" | "dubbed" | "failed";

export interface DubbingProject {
  dubbing_id: string;
  name?: string;
  status: DubbingStatus;
  target_languages?: string[];
  error?: string | null;
}
