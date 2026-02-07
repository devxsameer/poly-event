import { isAuthApiError } from "@supabase/supabase-js";
import { AUTH_ERROR_KEYS } from "./auth.errors";

export function mapSupabaseAuthError(error: unknown) {
  if (!isAuthApiError(error)) {
    return AUTH_ERROR_KEYS.UNKNOWN;
  }

  switch (error.code) {
    case "invalid_credentials":
      return AUTH_ERROR_KEYS.INVALID_CREDENTIALS;

    case "otp_expired":
      return AUTH_ERROR_KEYS.OTP_EXPIRED;

    // Supabase does NOT send otp_invalid
    // Wrong OTPs usually come as invalid_credentials
    // or mfa_verification_failed
    case "mfa_verification_failed":
      return AUTH_ERROR_KEYS.OTP_INVALID;

    case "email_not_confirmed":
      return AUTH_ERROR_KEYS.EMAIL_NOT_CONFIRMED;

    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
    case "over_sms_send_rate_limit":
      return AUTH_ERROR_KEYS.TOO_MANY_REQUESTS;

    case "no_authorization":
    case "not_admin":
      return AUTH_ERROR_KEYS.UNAUTHORIZED;

    case "session_expired":
    case "refresh_token_not_found":
      return AUTH_ERROR_KEYS.SESSION_EXPIRED;

    case "weak_password":
      return AUTH_ERROR_KEYS.WEAK_PASSWORD;

    case "user_banned":
      return AUTH_ERROR_KEYS.USER_BANNED;

    default:
      return AUTH_ERROR_KEYS.UNKNOWN;
  }
}
