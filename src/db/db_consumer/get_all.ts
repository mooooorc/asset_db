import type { Consumer } from "../../domain/consumer.js";
import { client } from "../client.js";

export const get_all_db_consumers = async (): Promise<Consumer[]> => {
  const result = await client.query(
    `
      SELECT id, name
      FROM consumers
      ORDER BY id
    `,
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
  }));
};