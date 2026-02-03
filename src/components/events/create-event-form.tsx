"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Loader2,
  MapPin,
  Clock,
  Type,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

import { Dictionary } from "@/features/i18n/dictionary.types";
import { createEventAction } from "@/features/events/event.actions";
import { ActionResult } from "@/features/shared/action-result";

interface CreateEventFormProps {
  initialLocale: string;
  dict: Dictionary;
}

// Get minimum datetime (now) in local format for datetime-local input
function getMinDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

// Get default datetime (1 hour from now) in local format
function getDefaultDateTime() {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  date.setMinutes(0);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function CreateEventForm({ initialLocale, dict }: CreateEventFormProps) {
  const router = useRouter();
  const [startTime, setStartTime] = useState(getDefaultDateTime);

  const [state, action, pending] = useActionState<
    ActionResult<{ eventId: string; locale: string }>,
    FormData
  >(createEventAction, { ok: false, error: "" });

  const t = dict.events.create;

  useEffect(() => {
    if (!state.ok) return;

    toast.success(t.toast.success, {
      description: t.toast.success_description,
      position: "top-center",
    });

    router.push(`/${state.data.locale}/events/${state.data.eventId}`);
  }, [state, router, t]);

  return (
    <Card className="border-border/50 bg-card/30 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Top highlight line */}
      <div className="h-1 bg-linear-to-r from-purple-500 via-blue-500 to-purple-500" />

      <CardContent className="pt-8 pb-8">
        <form action={action} className="space-y-6">
          {/* Hidden field: use current UI locale as event language */}
          <input type="hidden" name="original_language" value={initialLocale} />

          {!state.ok && state.error && (
            <Alert variant="destructive" className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Type className="h-4 w-4 text-muted-foreground" />
              {t.title_label}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder={t.title_placeholder}
              required
              minLength={3}
              maxLength={100}
              disabled={pending}
              autoFocus
              className="h-12 bg-secondary/30 border-border/50 focus:border-foreground/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              {t.description_label}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              required
              minLength={10}
              disabled={pending}
              placeholder={t.description_placeholder}
              className="bg-secondary/30 border-border/50 focus:border-foreground/50 resize-none"
            />
          </div>

          {/* Date/Time Grid */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {t.start_time_label} / {t.end_time_label}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="start_time"
                  className="text-xs text-muted-foreground"
                >
                  {t.start_time_label}
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  name="start_time"
                  required
                  min={getMinDateTime()}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={pending}
                  className="h-12 bg-secondary/30 border-border/50 focus:border-foreground/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="end_time"
                  className="text-xs text-muted-foreground"
                >
                  {t.end_time_label}
                  <span className="text-muted-foreground/50 ml-1 text-[10px]">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  name="end_time"
                  min={startTime}
                  disabled={pending}
                  className="h-12 bg-secondary/30 border-border/50 focus:border-foreground/50"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label
              htmlFor="location"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {t.location_label}
              <span className="text-muted-foreground/50 ml-1 text-[10px]">
                (optional)
              </span>
            </Label>
            <Input
              id="location"
              name="location"
              placeholder={t.location_placeholder}
              disabled={pending}
              className="h-12 bg-secondary/30 border-border/50 focus:border-foreground/50"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={pending}
              size="lg"
              className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 font-medium"
            >
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pending ? t.submitting : t.submit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
