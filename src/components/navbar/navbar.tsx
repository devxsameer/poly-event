"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/auth.actions";
import { LocalizedLink } from "../localized-link";
import { LanguageSwitcher } from "./language-switcher";
import { type Locale } from "@/features/i18n/config";

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "About", href: "/#about" },
];

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const pathname = usePathname();
  const params = useParams<{ locale: string }>();

  if (!pathname || !params?.locale) return null;

  const currentLocale = params.locale as Locale;

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center mx-auto px-4 md:px-6">
        <div className="flex w-full items-center justify-between">
          <LocalizedLink href="/" className="mr-6 font-bold">
            PolyEvent
          </LocalizedLink>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navigation.map((item) => (
              <LocalizedLink key={item.name} href={item.href}>
                {item.name}
              </LocalizedLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            <LanguageSwitcher
              currentLocale={currentLocale}
              pathname={pathname}
            />
            {user ? (
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                Sign out
              </Button>
            ) : (
              <LocalizedLink href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </LocalizedLink>
            )}
          </div>

          <button
            className="md:hidden ml-auto p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <LanguageSwitcher currentLocale={currentLocale} pathname={pathname} />
        </div>
      )}
    </header>
  );
}
