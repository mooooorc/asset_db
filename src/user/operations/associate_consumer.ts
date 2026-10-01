import type { ConsumerService } from "../../consumer/consumer.service.js";
import { client } from "../../db/client.js";
import type { UserId } from "../user.domain.js";

export const associate_user_to_consumer = async (
  userId: UserId,
  credential: string,
  consumerService: ConsumerService,
): Promise<boolean> => {
  const consumer = await consumerService.verify(credential);

  if (!consumer) {
    return false;
  }

  await client.query(
    `
      INSERT INTO user_consumers (
        user_id,
        consumer_id
      )
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `,
    [
      userId,
      consumer.id,
    ],
  );

  return true;
};