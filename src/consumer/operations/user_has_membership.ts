import { client } from "../../db/client.js";
import type { UserId } from "../../user/user.domain.js";
import type { ConsumerId, ConsumerMembership } from "../consumer.domain.js";

export const user_has_consumer_membership = async (
  userId: UserId,
  consumerId: ConsumerId,
  membership: ConsumerMembership,
): Promise<boolean> => {
  const result = await client.query(
    `
      SELECT 1
      FROM user_consumers
      WHERE user_id = $1
        AND consumer_id = $2
        AND membership = $3
      LIMIT 1
    `,
    [userId, consumerId, membership],
  );

  return result.rows.length > 0;
};