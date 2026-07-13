import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

export type ParsedBody<T> =
  | { ok: true; data: T }
  | { ok: false; response: Response };

/**
 * Parse a JSON request body, returning a discriminated result so callers can
 * short-circuit with their own 400 message while sharing the parse/guard.
 */
export async function parseJsonBody<T = unknown>(
  request: Request,
  invalidMessage = "Invalid request body.",
): Promise<ParsedBody<T>> {
  try {
    return { ok: true, data: (await request.json()) as T };
  } catch {
    return {
      ok: false,
      response: Response.json({ message: invalidMessage }, { status: 400 }),
    };
  }
}

/**
 * Map a caught error to a JSON Response: a `ResumeImportError` surfaces its own
 * message + status, anything else falls back to a generic 500.
 */
export function handleResumeImportError(
  error: unknown,
  fallbackMessage: string,
): Response {
  if (error instanceof ResumeImportError) {
    return Response.json({ message: error.message }, { status: error.status });
  }
  return Response.json({ message: fallbackMessage }, { status: 500 });
}
