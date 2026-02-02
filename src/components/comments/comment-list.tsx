import { Comment } from "@/features/comments/comment.types";
import { CommentItem } from "./comment-item";

export function CommentList({
  comments,
  locale,
}: {
  comments: Comment[];
  locale: string;
}) {
  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">No comments yet.</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} locale={locale} />
      ))}
    </div>
  );
}
