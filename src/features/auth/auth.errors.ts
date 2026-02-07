export const AUTH_ERROR_KEYS = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  OTP_EXPIRED: "OTP_EXPIRED",
  OTP_INVALID: "OTP_INVALID",
  EMAIL_NOT_CONFIRMED: "EMAIL_NOT_CONFIRMED",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNAUTHORIZED: "UNAUTHORIZED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  WEAK_PASSWORD: "WEAK_PASSWORD",
  USER_BANNED: "USER_BANNED",
  UNKNOWN: "UNKNOWN",
} as const;

export type AuthErrorKey =
  (typeof AUTH_ERROR_KEYS)[keyof typeof AUTH_ERROR_KEYS];

export class AuthError extends Error {
  constructor(public readonly key: AuthErrorKey) {
    super(key);
    this.name = "AuthError";
  }
}
