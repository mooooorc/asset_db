import { client } from "../../db/client.js";
import type { DiscussionId } from "../discussion.domain.js";

export const delete_discussion = async (
  id: DiscussionId,
): Promise<void> => {
  await client.query(
    `
      DELETE FROM discussions
      WHERE id = $1
    `,
    [id],
  );
};