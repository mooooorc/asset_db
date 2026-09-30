import { client } from "../../db/client.js";
import type { ConsumerId } from "../consumer.domain.js";


export const delete_consumer = async (
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