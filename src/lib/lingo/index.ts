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
