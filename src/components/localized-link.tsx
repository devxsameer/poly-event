"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import { defaultLocale } from "@/features/i18n/config";

type Props = ComponentProps<typeof Link>;

export function LocalizedLink({ href, ...rest }: Props) {
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? defaultLocale;

  let localizedHref = href;

  if (typeof href === "string" && href.startsWith("/")) {
    localizedHref = `/${locale}${href}`;
  } else if (
    typeof href === "object" &&
    href !== null &&
    href.pathname?.startsWith("/")
  ) {
    localizedHref = {
      ...href,
      pathname: `/${locale}${href.pathname}`,
    };
  }

  return <Link href={localizedHref} {...rest} />;
}
