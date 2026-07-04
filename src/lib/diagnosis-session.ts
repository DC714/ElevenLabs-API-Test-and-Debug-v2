import type { DiagnoseRequest } from "@/types/diagnosis";

function storageKey(id: string) {
  return `diagnosis:${id}`;
}

export function storeDiagnosisRequest(id: string, request: DiagnoseRequest) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(storageKey(id), JSON.stringify(request));
}

export function readDiagnosisRequest(id: string): DiagnoseRequest | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(storageKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DiagnoseRequest;
  } catch {
    return null;
  }
}
