"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  signInWithGitHub,
  sendOTP,
  verifyOTP,
} from "@/features/auth/auth.actions";
import { Loader2, Mail, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";

export default function LoginForm({ locale }: { locale: string }) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendOTP(formData: FormData) {
    setLoading(true);
    setError(null);

    const emailValue = formData.get("email") as string;
    const normalized = emailValue.trim().toLowerCase();
    setEmail(normalized);

    try {
      await sendOTP(normalized);
      setStep("otp");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(formData: FormData) {
    setLoading(true);
    setError(null);

    const code = formData.get("code") as string;

    try {
      await verifyOTP(email, code, `/${locale}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">PolyEvent</CardTitle>
          <CardDescription className="text-center">
            {step === "email"
              ? "Sign in or create an account"
              : `Enter the code sent to ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "email" ? (
            <>
              {/* GitHub OAuth (correct Server Action usage) */}
              <form action={signInWithGitHub}>
                <input type="hidden" name="next" value={`/${locale}`} />
                <Button className="w-full">Continue with GitHub</Button>
              </form>

              <div className="flex items-center gap-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>

              {/* Email OTP */}
              <form action={handleSendOTP} className="space-y-2">
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Send code
                </Button>
              </form>
            </>
          ) : (
            <form action={handleVerifyOTP} className="space-y-2">
              <Input
                name="code"
                placeholder="00000000"
                maxLength={8}
                className="text-center text-2xl tracking-widest"
                required
              />
              <Button className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="mr-2 h-4 w-4" />
                )}
                Verify & Sign In
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => setStep("email")}
              >
                <ArrowLeft className="mr-2 h-3 w-3" />
                Use different email
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter>
          <p className="w-full text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
