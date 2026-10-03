import { client } from "../../../db/client.js";
import type { UserId } from "../../../user/user.domain.js";
import type { DiscussionComment, DiscussionCommentId, DiscussionId } from "../../discussion.domain.js";

export const get_discussion_comment_by_id= async (
  commentId: DiscussionCommentId,
): Promise<DiscussionComment | null> => {
  const result = await client.query(
    `
      SELECT
        id,
        discussion_id,
        author_id,
        content
      FROM discussion_comments
      WHERE id = $1
    `,
    [commentId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id as DiscussionCommentId,
    discussion: row.discussion_id as DiscussionId,
    author: row.author_id as UserId,
    content: row.content,
  };
};