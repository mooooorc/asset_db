import { client } from "../../db/client.js";
import type { Consumer } from "../consumer.domain.js";


export const get_all_consumers = async (): Promise<Consumer[]> => {
  const result = await client.query(
    `
      SELECT
        id,
        name
      FROM consumers
      ORDER BY id
    `,
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
  }));
};