export const AUTH_ERROR_KEYS = {
  EMAIL_INVALID: "email_invalid",
  INVALID_CREDENTIALS: "invalid_credentials",
  OTP_EXPIRED: "otp_expired",
  OTP_INVALID: "otp_invalid",
  EMAIL_NOT_CONFIRMED: "email_not_confirmed",
  TOO_MANY_REQUESTS: "too_many_requests",
  UNAUTHORIZED: "unauthorized",
  UNKNOWN: "unknown",
} as const;

export type AuthErrorKey =
  (typeof AUTH_ERROR_KEYS)[keyof typeof AUTH_ERROR_KEYS];

export class AuthError extends Error {
  constructor(public readonly key: AuthErrorKey) {
    super(key);
    this.name = "AuthError";
  }
}
