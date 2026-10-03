import { client } from "../../../db/client.js";
import type { DiscussionCommentId } from "../../discussion.domain.js";

export const delete_discussion_comment = async (
  commentId: DiscussionCommentId,
): Promise<void> => {
  await client.query(
    `
      DELETE FROM discussion_comments
      WHERE id = $1
    `,
    [commentId],
  );
};