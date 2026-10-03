import { client } from "../../db/client.js";
import type {
  ConsumerId,
  ConsumerMembership,
} from "../../consumer/consumer.domain.js";
import type { UserId } from "../user.domain.js";

export const get_user_consumers = async (userId: UserId) => {
  const result = await client.query(
    `
      SELECT consumer_id, membership
      FROM user_consumers
      WHERE user_id = $1
    `,
    [userId],
  );

  return result.rows.map((row) => ({
    consumerId: row.consumer_id as ConsumerId,
    membership: row.membership as ConsumerMembership,
  }));
};
