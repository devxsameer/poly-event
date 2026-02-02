"use client";

import * as React from "react";
import { Menu, X, Globe, ChevronRight } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/auth.actions";
import { LocalizedLink } from "../localized-link";
import { LanguageSwitcher } from "./language-switcher";
import { type Locale } from "@/features/i18n/config";
import { Dictionary } from "@/features/i18n/dictionary.types";

interface NavbarProps {
  user: User | null;
  dict: Dictionary;
}

export function Navbar({ user, dict }: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();

  // Close mobile menu on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!pathname || !params?.locale) return null;
  const locale = params.locale as Locale;

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      setOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background md:bg-background/95 backdrop-blur-xl md:supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <LocalizedLink
          href="/"
          className="flex items-center gap-2.5 font-semibold text-foreground transition-colors hover:text-foreground/80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
            <Globe className="h-4 w-4" />
          </div>
          <span className="text-lg tracking-tight">PolyEvent</span>
        </LocalizedLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <LocalizedLink
            href="/events"
            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-accent"
          >
            {dict.nav.events}
          </LocalizedLink>
          {user && (
            <LocalizedLink
              href="/dashboard/events/new"
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-accent"
            >
              {dict.nav.create}
            </LocalizedLink>
          )}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} pathname={pathname} />

          {user ? (
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              {dict.common.logout}
            </Button>
          ) : (
            <LocalizedLink href="/login">
              <Button size="sm" className="rounded-full px-4">
                {dict.common.login}
              </Button>
            </LocalizedLink>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div
          className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed inset-x-0 top-16 z-50 md:hidden transition-all duration-300 ease-out ${
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="mx-4 rounded-xl border border-border bg-card p-4 shadow-2xl">
          <div className="space-y-1">
            <LocalizedLink
              href="/events"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
            >
              {dict.nav.events}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </LocalizedLink>

            {user && (
              <LocalizedLink
                href="/dashboard/events/new"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
              >
                {dict.nav.create_event}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </LocalizedLink>
            )}
          </div>

          <div className="my-4 border-t border-border/50" />

          <div className="space-y-3 px-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Language</span>
              <LanguageSwitcher currentLocale={locale} pathname={pathname} />
            </div>
          </div>

          <div className="my-4 border-t border-border/50" />

          <div className="px-4">
            {user ? (
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full justify-center"
              >
                {dict.common.logout}
              </Button>
            ) : (
              <LocalizedLink href="/login" onClick={() => setOpen(false)}>
                <Button className="w-full justify-center">
                  {dict.common.login}
                </Button>
              </LocalizedLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
