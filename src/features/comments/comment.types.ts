export type CommentTranslation = {
  locale: string;
  translated_content: string | null;
  status: string;
};

export type Comment = {
  id: string;
  event_id: string;
  original_language: string;
  original_content: string;
  created_at: string;

  // resolved view
  content: string;

  translation?: CommentTranslation;
};
