import type { ConsumerId } from "../../consumer/consumer.domain.js";
import { client } from "../../db/client.js";
import type { UserId } from "../user.domain.js";

export const unlink_user_from_consumer = async (
  userId: UserId,
  consumerId: ConsumerId,
): Promise<void> => {
  await client.query(
    `
      DELETE FROM user_consumers
      WHERE user_id = $1
        AND consumer_id = $2
    `,
    [userId, consumerId],
  );
};