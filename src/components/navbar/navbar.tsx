"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/auth.actions";
import { LocalizedLink } from "../localized-link";
import { LanguageSwitcher } from "./language-switcher";

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

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-4 md:px-6">
        <div className="flex w-full items-center justify-between">
          {/* Logo */}
          <LocalizedLink href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">PolyEvent</span>
          </LocalizedLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navigation.map((item) => (
              <LocalizedLink
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </LocalizedLink>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <LanguageSwitcher />
            {user ? (
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                Sign out
              </Button>
            ) : (
              <>
                <LocalizedLink href={`/login`}>
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </LocalizedLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-auto p-2 text-foreground/60 hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <nav className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t">
              <LanguageSwitcher />
              {user ? (
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  Sign out
                </Button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
