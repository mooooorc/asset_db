import { client } from "../../db/client.js";
import type { PackageId } from "../../package/package.domain.js";
import type { Discussion, DiscussionId, NewDiscussion } from "../discussion.domain.js";
import {randomUUID} from "node:crypto"

const update_discussion_counter = async (
  packageId: PackageId,
): Promise<number> => {
  const result = await client.query(
    `
      UPDATE discussion_counters
      SET next_index = next_index + 1
      WHERE package_id = $1
      RETURNING next_index - 1 AS index
    `,
    [packageId],
  );

  if (result.rows.length === 0) {
    throw new Error(`Discussion counter not found: ${packageId}`);
  }

  return result.rows[0].index;
};

export const save_discussion = async (
  discussion: NewDiscussion,
): Promise<Discussion> => {
  const index = await update_discussion_counter(discussion.package);

  const newDiscussion: Discussion = {
    ...discussion,
    id: randomUUID() as DiscussionId,
    index,
  };

  await client.query(
    `
      INSERT INTO discussions (
        id,
        package_id,
        index,
        title,
        author_id,
        consumer_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      newDiscussion.id,
      newDiscussion.package,
      newDiscussion.index,
      newDiscussion.title,
      newDiscussion.author,
      newDiscussion.consumer
    ],
  );

  return newDiscussion;
};