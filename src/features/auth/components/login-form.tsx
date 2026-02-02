"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signInWithGitHub,
  sendOTP,
  verifyOTP,
} from "@/features/auth/auth.actions";
import {
  Loader2,
  Mail,
  ArrowLeft,
  KeyRound,
  Github,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Dictionary } from "@/features/i18n/dictionary.types";

type Step = "email" | "otp";

interface LoginFormProps {
  locale: string;
  dict: Dictionary;
}

export default function LoginForm({ locale, dict }: LoginFormProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  const t = dict.auth;

  function handleSendOTP(formData: FormData) {
    const emailValue = formData.get("email") as string;
    const normalized = emailValue.trim().toLowerCase();

    if (!normalized || !normalized.includes("@")) {
      toast.error(t.toast.invalid_email, {
        position: "top-center",
      });
      return;
    }

    setEmail(normalized);

    startTransition(async () => {
      try {
        await sendOTP(normalized);
        setStep("otp");
        toast.success(t.toast.code_sent, {
          description: `${t.toast.check_inbox} ${normalized}`,
          icon: <CheckCircle2 className="h-4 w-4" />,
          position: "top-center",
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : t.toast.failed_to_send;
        toast.error(t.toast.error, {
          description: message,
          position: "top-center",
        });
      }
    });
  }

  function handleVerifyOTP(formData: FormData) {
    const code = formData.get("code") as string;

    if (!code || code.length < 6) {
      toast.error(t.toast.enter_full_code, {
        position: "top-center",
      });
      return;
    }

    startTransition(async () => {
      try {
        await verifyOTP(email, code, `/${locale}`);
        toast.success(t.toast.welcome_back, {
          description: t.toast.redirecting,
          icon: <Sparkles className="h-4 w-4" />,
          position: "top-center",
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : t.toast.invalid_code;
        toast.error(t.toast.verification_failed, {
          description: message,
          position: "top-center",
        });
      }
    });
  }

  function handleResendCode() {
    startTransition(async () => {
      try {
        await sendOTP(email);
        toast.success(t.toast.new_code_sent, {
          description: `${t.toast.check_inbox} ${email}`,
          position: "top-center",
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : t.toast.failed_to_send;
        toast.error(t.toast.resend_failed, {
          description: message,
          position: "top-center",
        });
      }
    });
  }

  function handleGoBack() {
    setStep("email");
    setEmail("");
  }

  return (
    <main className="relative flex min-h-[90vh] items-center justify-center px-4 bg-background overflow-x-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-sm mx-auto">
        <Card className="border-border/50 bg-card shadow-xl">
          <CardHeader className="text-center pb-2 pt-6">
            {/* Compact inline logo + title */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                PolyEvent
              </span>
            </div>
            <CardTitle className="text-xl">
              {step === "email" ? t.welcome_back : t.check_your_email}
            </CardTitle>
            <CardDescription className="text-sm">
              {step === "email" ? (
                t.sign_in_to_continue
              ) : (
                <>
                  {t.code_sent_to}{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === "email" ? (
              <>
                {/* GitHub OAuth */}
                <form
                  action={signInWithGitHub}
                  onSubmit={() => setIsGitHubLoading(true)}
                >
                  <input type="hidden" name="next" value={`/${locale}`} />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full h-11 gap-2"
                    disabled={isPending || isGitHubLoading}
                  >
                    {isGitHubLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Github className="h-4 w-4" />
                    )}
                    {t.continue_with_github}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {t.or_continue_with_email}
                    </span>
                  </div>
                </div>

                {/* Email OTP */}
                <form action={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="sr-only">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t.email_placeholder}
                      required
                      autoComplete="email"
                      autoFocus
                      disabled={isPending}
                      className="h-11 bg-secondary/30 border-border/50 focus:border-foreground/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    {isPending ? t.sending_code : t.continue_with_email}
                  </Button>
                </form>
              </>
            ) : (
              <form action={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="sr-only">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder={t.enter_code}
                    maxLength={8}
                    autoFocus
                    autoComplete="one-time-code"
                    disabled={isPending}
                    className="h-14 text-center text-2xl tracking-[0.5em] font-mono bg-secondary/30 border-border/50 focus:border-foreground/50"
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    {t.code_hint}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="mr-2 h-4 w-4" />
                  )}
                  {isPending ? t.verifying : t.verify_and_sign_in}
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleGoBack}
                    disabled={isPending}
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    {dict.common.back}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleResendCode}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : null}
                    {t.resend_code}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="pt-4">
            <p className="w-full text-center text-xs text-muted-foreground leading-relaxed">
              {t.terms_agreement}{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {t.terms_of_service}
              </a>{" "}
              {t.and}{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {t.privacy_policy}
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
