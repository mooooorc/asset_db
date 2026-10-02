import { client } from "../../../db/client.js";
import type { DiscussionId } from "../../discussion.domain.js";


export const get_discussion_supports = async (
  discussionId: DiscussionId,
) => {
  const result = await client.query(
    `
      SELECT
        discussion_id,
        user_id,
        consumer_id
      FROM discussion_supports
      WHERE discussion_id = $1
    `,
    [discussionId],
  );

  return result.rows;
};