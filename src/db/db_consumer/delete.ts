import type { ConsumerId } from "../../domain/consumer.js";
import { client } from "../client.js";

export const delete_db_consumer = async (
  id: ConsumerId,
): Promise<void> => {
  await client.query(
    `
      DELETE FROM consumers
      WHERE id = $1
    `,
    [id],
  );
};