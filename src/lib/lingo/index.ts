/**
 * Lingo.dev SDK Configuration
 *
 * Centralized configuration for the Lingo.dev translation engine.
 * This module exports a singleton instance of the LingoDotDevEngine
 * configured with the API key from environment variables.
 *
 * @see https://lingo.dev/docs
 */

import { LingoDotDevEngine } from "lingo.dev/sdk";

if (!process.env.LINGODOTDEV_API_KEY) {
  console.warn(
    "[lingo] LINGODOTDEV_API_KEY is not set. Translations will fail.",
  );
}

/**
 * Singleton instance of the Lingo.dev translation engine.
 * Use this for all translation operations throughout the app.
 */
export const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY || "",
});

/**
 * Localize a single text string from source to target locale.
 */
export async function localizeText(
  text: string,
  options: { sourceLocale: string; targetLocale: string },
) {
  if (options.sourceLocale === options.targetLocale) {
    return text;
  }
  return lingo.localizeText(text, options);
}

/**
 * Localize an object with multiple text fields.
 */
export async function localizeObject<T extends Record<string, string>>(
  obj: T,
  options: { sourceLocale: string; targetLocale: string },
) {
  if (options.sourceLocale === options.targetLocale) {
    return obj;
  }
  return lingo.localizeObject(obj, options);
}
