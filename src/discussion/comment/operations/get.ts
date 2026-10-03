import { client } from "../../../db/client.js";
import type { DiscussionId } from "../../discussion.domain.js";

export const get_discussion_comments = async (
  discussionId: DiscussionId,
) => {
  const result = await client.query(
    `
      SELECT
        id,
        discussion_id,
        author_id,
        content
      FROM discussion_comments
      WHERE discussion_id = $1
    `,
    [discussionId],
  );

  return result.rows;
};