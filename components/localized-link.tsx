"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link>;

export function LocalizedLink({ href, ...rest }: Props) {
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  if (!locale) return <Link href={href} {...rest} />;

  let localizedHref = href;

  if (typeof href === "string" && href.startsWith("/")) {
    localizedHref = `/${locale}${href}`;
  } else if (typeof href === "object" && href?.pathname) {
    localizedHref = {
      ...href,
      pathname: `/${locale}${href.pathname}`,
    };
  }

  return <Link href={localizedHref} {...rest} />;
}
