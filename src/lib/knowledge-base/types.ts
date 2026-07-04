export type ErrorCategory =
  | "authentication"
  | "rate_limit"
  | "quota_billing"
  | "validation"
  | "resource_not_found"
  | "conflict"
  | "conversational_ai_websocket"
  | "server_error";

export type Severity = "low" | "medium" | "high" | "critical";

export interface KBEntry {
  /** Stable identifier, e.g. "invalid_api_key" or "ws_close_1002" */
  id: string;
  /** Human-readable name shown in the UI */
  title: string;
  /** ElevenLabs error code / websocket close code as documented */
  errorCode: string;
  /** HTTP status if applicable (REST errors); null for pure WS close codes */
  httpStatus: number | null;
  category: ErrorCategory;
  severity: Severity;
  /** Short description matching ElevenLabs docs language */
  description: string;
  /** Likely root causes, ordered by frequency/likelihood */
  likelyCauses: string[];
  /** Concrete, ordered remediation steps an FDE can hand to a client */
  remediationSteps: string[];
  /** Links to ElevenLabs docs / related resources */
  relatedDocs: { label: string; url: string }[];
  /** Free-text search aids: alternate phrasings, common log snippets */
  keywords: string[];
  /** Whether this applies to REST APIs, WebSocket/Conversational AI, or both */
  surface: ("rest" | "websocket")[];
  /** ISO date this entry was last checked against ElevenLabs' docs */
  lastVerified: string;
}
