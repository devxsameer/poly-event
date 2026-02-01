import { locales } from "./config";

export function getLocaleFromPathname(pathname: string) {
  const segment = pathname.split("/")[1];
  if (!segment) return null;
  return locales.includes(segment as any) ? segment : null;
}
