import type { ConsumerId } from "../../consumer/consumer.domain.js";
import type { ConsumerService } from "../../consumer/consumer.service.js";
import { client } from "../../db/client.js";
import type { UserId } from "../user.domain.js";

export const link_user_to_consumer = async (
  userId: UserId,
  consumerId: ConsumerId,
): Promise<void> => {
  await client.query(
    `
      INSERT INTO user_consumers (
        user_id,
        consumer_id
      )
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `,
    [userId, consumerId],
  );
};