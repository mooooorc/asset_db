import type { ConsumerId } from "../../domain/consumer.js";
import { client } from "../client.js";

export const get_db_consumer = async (
  id: ConsumerId,
) => {
  const result = await client.query(
    `
      SELECT id, name
      FROM consumers
      WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return {
    id: result.rows[0].id as ConsumerId,
    name: result.rows[0].name,
  };
};