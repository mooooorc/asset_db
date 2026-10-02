import { client } from "../../db/client.js";
import type { Discussion } from "../discussion.domain.js";

export const get_all_discussions = async (): Promise<Discussion[]> => {
  const result = await client.query(`
    SELECT
      id,
      package_id,
      index,
      title,
      author_id,
      consumer_id
    FROM discussions
    ORDER BY package_id, index
  `);

  return result.rows.map((row) => ({
    id: row.id,
    package: row.package_id,
    index: row.index,
    title: row.title,
    author: row.author_id,
    consumer: row.consumer_id
  }));
};