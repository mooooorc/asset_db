import { client } from "../../../db/client.js";
import { randomUUID} from "node:crypto"
import type { DiscussionComment, DiscussionCommentId, NewDiscussionComment } from "../../discussion.domain.js";

export const save_discussion_comment = async (
  comment: NewDiscussionComment,
): Promise<DiscussionComment> => {
  const newComment: DiscussionComment = {
    ...comment,
    id: randomUUID() as DiscussionCommentId,
  };

  await client.query(
    `
      INSERT INTO discussion_comments (
        id,
        discussion_id,
        author_id,
        content
      )
      VALUES ($1, $2, $3, $4)
    `,
    [
      newComment.id,
      newComment.discussion,
      newComment.author,
      newComment.content,
    ],
  );

  return newComment;
};