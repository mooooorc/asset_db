import type { ConsumerId, ConsumerMembership } from "../../consumer/consumer.domain.js";
import type { ConsumerService } from "../../consumer/consumer.service.js";
import { client } from "../../db/client.js";
import type { UserId } from "../user.domain.js";

export const link_user_to_consumer = async (
  userId: UserId,
  consumerId: ConsumerId,
  membership: ConsumerMembership
): Promise<void> => {
  await client.query(
    `
      INSERT INTO user_consumers (
        user_id,
        consumer_id,
        membership
      )
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `,
    [userId, consumerId, membership],
  );
};