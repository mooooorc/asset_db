import type { ConsumerId } from "../../../consumer/consumer.domain.js";
import { client } from "../../../db/client.js";
import type { UserId } from "../../../user/user.domain.js";
import type { DiscussionId } from "../../discussion.domain.js";

export const save_support_discussion = async (
  discussionId: DiscussionId,
  userId: UserId,
  consumerId: ConsumerId,
): Promise<void> => {
  await client.query(
    `
      INSERT INTO discussion_supports (
        discussion_id,
        user_id,
        consumer_id
      )
      VALUES ($1, $2, $3)
    `,
    [discussionId, userId, consumerId],
  );
};