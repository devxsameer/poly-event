"use client";

import { useActionState, useEffect, startTransition } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

import { Dictionary } from "@/features/i18n/dictionary.types";
import { Locale } from "@/features/i18n/config";
import { createEventAction } from "@/features/events/event.actions";
import {
  CreateEventState,
  initialCreateEventState,
} from "@/features/events/event.types";
import {
  createEventSchema,
  CreateEventInput,
} from "@/features/events/event.schema";

/* -------------------------------- utilities -------------------------------- */

function toLocalDateTime(date: Date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function getMinStartTime() {
  return toLocalDateTime(new Date());
}

export function getDefaultStartTime() {
  return toLocalDateTime(new Date(Date.now() + 60 * 60 * 1000));
}
/* -------------------------------- component -------------------------------- */

interface CreateEventFormProps {
  initialLocale: Locale;
  dict: Dictionary;
}

export function CreateEventForm({ initialLocale, dict }: CreateEventFormProps) {
  const router = useRouter();
  const t = dict.events.create;

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      end_time: "",
      start_time: getDefaultStartTime(),
      original_language: initialLocale,
    },
    mode: "onSubmit",
  });

  const [state, action, pending] = useActionState<CreateEventState, FormData>(
    createEventAction,
    initialCreateEventState,
  );

  const isSubmitting = pending || state.status === "success";

  useEffect(() => {
    if (state.status !== "success") return;

    toast.success(t.toast.success, {
      description: t.toast.success_description,
      position: "top-center",
    });

    router.push(`/${state.data.locale}/events/${state.data.eventId}`);
  }, [state, router, t]);

  return (
    <Card className="border-border/50 bg-card/30 backdrop-blur-sm shadow-xl">
      <div className="h-1 bg-linear-to-r from-purple-500 via-blue-500 to-purple-500" />

      <CardContent className="py-8">
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((data) => {
            console.log(data);
            const fd = new FormData();
            for (const [key, value] of Object.entries(data)) {
              if (value !== null && value !== undefined) {
                fd.append(key, String(value));
              }
            }
            startTransition(() => {
              action(fd);
            });
          })}
        >
          <input type="hidden" {...form.register("original_language")} />

          {state.status === "error" && (
            <Alert variant="destructive" className="flex gap-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <AlertDescription>{state.error.message}</AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <Field
            label={t.title_label}
            icon={<Type className="h-4 w-4" />}
            error={form.formState.errors.title?.message}
            required
          >
            <Input
              {...form.register("title")}
              autoFocus
              disabled={isSubmitting}
              placeholder={t.title_placeholder}
              className="h-12"
            />
          </Field>

          {/* Description */}
          <Field
            label={t.description_label}
            icon={<FileText className="h-4 w-4" />}
            error={form.formState.errors.description?.message}
            required
          >
            <Textarea
              {...form.register("description")}
              rows={5}
              disabled={isSubmitting}
              placeholder={t.description_placeholder}
              className="resize-none"
            />
          </Field>

          {/* Date / Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {t.start_time_label} / {t.end_time_label}
            </Label>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                type="datetime-local"
                min={getMinStartTime()}
                disabled={isSubmitting}
                {...form.register("start_time")}
              />
              <Input
                type="datetime-local"
                disabled={isSubmitting}
                {...form.register("end_time")}
              />
            </div>

            {form.formState.errors.end_time && (
              <p className="text-xs text-destructive">
                {form.formState.errors.end_time.message}
              </p>
            )}
          </div>

          {/* Location */}
          <Field label={t.location_label} icon={<MapPin className="h-4 w-4" />}>
            <Input
              {...form.register("location")}
              disabled={isSubmitting}
              placeholder={t.location_placeholder}
            />
          </Field>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* ------------------------------ small helper ------------------------------ */

function Field({
  label,
  icon,
  error,
  required,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
