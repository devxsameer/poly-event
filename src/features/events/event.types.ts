export type CreateEventInput = {
  title: string;
  description: string;
  start_time: string;
  end_time?: string | null;
  location?: string | null;
  original_language: string;
};

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
