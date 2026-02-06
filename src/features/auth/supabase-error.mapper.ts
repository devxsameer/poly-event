import { AUTH_ERROR_KEYS } from "./auth.errors";

export function mapSupabaseAuthError(error: unknown) {
  if (!(error instanceof Error)) {
    return AUTH_ERROR_KEYS.UNKNOWN;
  }

  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return AUTH_ERROR_KEYS.INVALID_CREDENTIALS;
  }

  if (message.includes("expired") || message.includes("token has expired")) {
    return AUTH_ERROR_KEYS.OTP_EXPIRED;
  }

  if (message.includes("invalid") && message.includes("token")) {
    return AUTH_ERROR_KEYS.OTP_INVALID;
  }

  if (message.includes("email not confirmed")) {
    return AUTH_ERROR_KEYS.EMAIL_NOT_CONFIRMED;
  }

  if (message.includes("too many requests")) {
    return AUTH_ERROR_KEYS.TOO_MANY_REQUESTS;
  }

  if (message.includes("unauthorized")) {
    return AUTH_ERROR_KEYS.UNAUTHORIZED;
  }

  return AUTH_ERROR_KEYS.UNKNOWN;
}
