import { client } from "../../db/client.js";
import type { Consumer, ConsumerId } from "../consumer.domain.js";


export const get_consumer = async (
  id: ConsumerId,
): Promise<Consumer | null> => {
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

  const packagesResult = await client.query(
    `
      SELECT package_id
      FROM consumer_packages
      WHERE consumer_id = $1
    `,
    [id],
  );

  return {
    id: result.rows[0].id as ConsumerId,
    name: result.rows[0].name
  };
};