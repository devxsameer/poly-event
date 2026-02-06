import { z } from "zod";
import { AUTH_ERROR_KEYS } from "./auth.errors";

export const emailSchema = z
  .email({ message: AUTH_ERROR_KEYS.EMAIL_INVALID })
  .trim()
  .toLowerCase();

export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, { message: AUTH_ERROR_KEYS.OTP_INVALID });

export const sendOtpSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  code: otpSchema,
});
