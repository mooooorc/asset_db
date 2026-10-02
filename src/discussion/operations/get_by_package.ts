import { client } from "../../db/client.js";
import type { PackageId } from "../../package/package.domain.js";
import type { Discussion } from "../discussion.domain.js";

export const get_discussions_by_package = async (
  packageId: PackageId,
): Promise<Discussion[]> => {
  const result = await client.query(
    `
      SELECT
        id,
        package_id,
        index,
        title,
        author_id,
        consumer_id
      FROM discussions
      WHERE package_id = $1
      ORDER BY index
    `,
    [packageId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    package: row.package_id,
    index: row.index,
    title: row.title,
    author: row.author_id,
    consumer: row.consumer_id
  }));
};