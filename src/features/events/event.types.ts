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

export type DbTranslationStatus = "pending" | "completed" | "failed";
export type UiTranslationStatus = DbTranslationStatus | "translating";
export type TranslationStatus = DbTranslationStatus | "missing";

export type EventWithTranslation = EventBase & {
  translationStatus: TranslationStatus;
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
  locale:
    | "en"
    | "es"
    | "fr"
    | "de"
    | "pt"
    | "hi"
    | "ar"
    | "ja"
    | "zh-Hans"
    | "ko"
    | "ru"
    | "id";
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
