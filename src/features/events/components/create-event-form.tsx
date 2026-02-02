"use client";

import { useActionState } from "react";
import { Loader2, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { locales } from "@/features/i18n/config";
import {
  createEventAction,
  CreateEventActionState,
} from "@/features/events/event.actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CreateEventForm({ initialLocale }: { initialLocale: string }) {
  const [state, action, pending] = useActionState<
    CreateEventActionState,
    FormData
  >(createEventAction, { status: "idle" });

  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Event created", {
        description: "Translations will appear automatically as they complete.",
        position: "top-center",
      });

      router.push(`/${state.locale}/events/${state.eventId}`);
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-8">
      {state.status === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Language */}
      <div className="space-y-2">
        <Label>Event language</Label>
        <Select name="original_language" defaultValue={initialLocale}>
          <SelectTrigger>
            <Languages className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locales.map((l) => (
              <SelectItem key={l} value={l}>
                {l.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          This is the language you`ll write the event in.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Title</Label>
        <Input name="title" />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea name="description" rows={5} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="datetime-local" name="start_time" />
        <Input type="datetime-local" name="end_time" />
      </div>

      <Input name="location" placeholder="Location (optional)" />

      <Button disabled={pending} className="w-full">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create event
      </Button>
    </form>
  );
}
