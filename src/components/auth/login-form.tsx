"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
  Sparkles,
} from "lucide-react";
import { Dictionary } from "@/features/i18n/dictionary.types";
import { initialActionState } from "@/features/shared/action-state";

type Step = "email" | "otp";

interface LoginFormProps {
  locale: string;
  dict: Dictionary;
}

export default function LoginForm({ locale, dict }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [sendState, sendAction, sending] = useActionState(
    sendOTP,
    initialActionState,
  );
  const [verifyState, verifyAction, verifying] = useActionState(
    verifyOTP,
    initialActionState,
  );

  const step: Step = sendState.status === "success" ? "otp" : "email";

  const sendError = sendState.status === "error" ? sendState.error : undefined;
  const lastHandledStatus = useRef<"success" | "error" | null>(null);

  const t = dict.auth;

  useEffect(() => {
    if (sendState.status !== "success" && sendState.status !== "error") return;
    if (lastHandledStatus.current === sendState.status) {
      return;
    }
    if (sendState.status === "success") {
      toast.success(t.toast.code_sent, {
        description: `${t.toast.check_inbox} ${email}`,
        position: "top-center",
      });
    }

    if (sendState.status === "error" && sendError) {
      toast.error(t.toast.error, {
        description: t.errors[sendError] ?? t.toast.failed_to_send,
        position: "top-center",
      });
    }
    lastHandledStatus.current = sendState.status;
  }, [sendState.status, sendError, email, t]);

  function handleGoBack() {
    lastHandledStatus.current = null;
    setEmail("");
  }

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 bg-background overflow-x-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)",
          }}
        />
      </div>

      <div className="w-full max-w-sm mx-auto py-8">
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm shadow-xl overflow-hidden">
          {/* Top highlight line */}
          <div className="h-1 bg-linear-to-r from-purple-500 via-blue-500 to-purple-500" />

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
                    disabled={isGitHubLoading}
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
                <form action={sendAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="sr-only">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder={t.email_placeholder}
                      autoComplete="email"
                      autoFocus
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={sending}
                      className="h-11 bg-secondary/30 border-border/50 focus:border-foreground/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={sending}
                  >
                    {sending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    {sending ? t.sending_code : t.continue_with_email}
                  </Button>
                </form>
              </>
            ) : (
              <form action={verifyAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="sr-only">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder={t.enter_code}
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    autoComplete="one-time-code"
                    disabled={verifying}
                    className="h-14 text-center text-2xl tracking-[0.5em] font-mono bg-secondary/30 border-border/50 focus:border-foreground/50"
                  />
                  {verifyState.status === "error" && (
                    <p className="text-sm text-destructive">
                      {t.errors[verifyState.error]}
                    </p>
                  )}
                  <p className="text-xs text-center text-muted-foreground">
                    {t.code_hint}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={verifying}
                >
                  {verifying ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="mr-2 h-4 w-4" />
                  )}
                  {verifying ? t.verifying : t.verify_and_sign_in}
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleGoBack}
                    disabled={sending}
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    {dict.common.back}
                  </Button>
                  <input type="hidden" name="email" value={email} />
                  <input type="hidden" name="locale" value={locale} />
                  <Button
                    variant="ghost"
                    formAction={sendAction}
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    disabled={sending}
                  >
                    {sending ? (
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
