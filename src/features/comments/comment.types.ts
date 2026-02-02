export type CreateCommentInput = {
  event_id: string;
  content: string;
  original_language: string;
};

export type Comment = {
  id: string;
  event_id: string;
  content: string;
  original_language: string;
  created_at: string;
  hasTranslation: boolean;
};
