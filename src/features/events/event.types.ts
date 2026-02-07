import { Locale } from "@/features/i18n/config";
import { ActionState } from "../shared/action-state";

export type EventBase = {
  id: string;
  title: string;
  description: string;
  original_language: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
};

export type EventWithTranslation = EventBase & {
  hasTranslation: boolean;
};

export type RawEvent = {
  id: string;
  original_language: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  title: string;
  description: string;
  event_translations?: {
    locale: string;
    translated_title: string;
    translated_description: string;
  }[];
};

type CreateEventSuccess = {
  eventId: string;
  locale: Locale;
};
export type EventTranslation = {
  locale: string;
  translated_title: string | null;
  translated_description: string | null;
  status: string;
  last_error: string | null;
};
export type EventRowWithTranslations = {
  id: string;
  title: string;
  description: string;
  original_language: string;
  start_time: string; // timestamptz → string
  end_time: string | null;
  location: string | null;
  event_translations: EventTranslation[] | null;
};
export type EventWithResolvedTranslation = Omit<
  EventRowWithTranslations,
  "event_translations"
> & {
  translation?: EventTranslation;
};

type CreateEventError =
  | { code: "VALIDATION"; message: string }
  | { code: "AUTH"; message: string }
  | { code: "UNKNOWN"; message: string };

export type CreateEventState = ActionState<
  CreateEventSuccess,
  CreateEventError
>;

export const initialCreateEventState: CreateEventState = {
  status: "idle",
};
