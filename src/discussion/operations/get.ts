import { client } from "../../db/client.js";
import type { DiscussionId, Discussion } from "../discussion.domain.js";

export const get_discussion = async (
  id: DiscussionId,
): Promise<Discussion | null> => {
  const result = await client.query(
    `
      SELECT
        id,
        package_id,
        index,
        title,
        author_id
      FROM discussions
      WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id,
    package: row.package_id,
    index: row.index,
    title: row.title,
    author: row.author_id,
  };
};