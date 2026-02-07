import { z } from "zod";
import { AUTH_ERROR_KEYS } from "./auth.errors";

export const emailSchema = z
  .email({ message: AUTH_ERROR_KEYS.INVALID_CREDENTIALS })
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

export const nextPathSchema = z
  .string()
  .min(1)
  .max(200)
  .refine(
    (val) => val.startsWith("/") && !val.startsWith("//"),
    "Invalid redirect path",
  );
