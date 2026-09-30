import { client } from "../../db/client.js";
import type { ConsumerId } from "../consumer.domain.js";


export const get_consumer = async (
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