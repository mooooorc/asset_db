import type { Instance } from "../domain/instance.js";
import { client } from "./client.js";

function createInsertQuery(instance: Instance) {
  const properties = Object.keys(instance.properties);

  const columns = ["asset_db_ID", ...properties]
    .map((column) => `"${column}"`)
    .join(", ");

  const values = properties
    .map((_, index) => `$${index + 2}`)
    .join(", ");

  return {
    query: `
      INSERT INTO "${instance.type}" (${columns})
      VALUES ($1, ${values})
    `,
    values: [
      instance.asset_db_id,
      ...properties.map((property) => instance.properties[property]),
    ],
  };
}

export const db_instance = {
  save: async (instance: Instance) => {
    await client.connect();

    try {
      const { query, values } = createInsertQuery(instance);

      await client.query(query, values);
    } finally {
      await client.end();
    }
  },
};