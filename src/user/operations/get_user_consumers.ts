import { client } from "../../db/client.js";
import type { ConsumerId } from "../../consumer/consumer.domain.js";
import type { UserId } from "../user.domain.js";

export const get_user_consumers = async (
  userId: UserId,
): Promise<ConsumerId[]> => {
  const result = await client.query(
    `
      SELECT consumer_id
      FROM user_consumers
      WHERE user_id = $1
    `,
    [userId],
  );

  return result.rows.map(
    (row) => row.consumer_id as ConsumerId,
  );
};