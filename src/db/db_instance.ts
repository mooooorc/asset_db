import type { AssetId } from "../domain/asset.js";
import type { Instance, InstanceId } from "../domain/instance.js";
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
      ...properties.map(
        (property) => instance.properties[property],
      ),
    ],
  };
}

export const db_instance = {
  save: async (instance: Instance) => {
    const { query, values } = createInsertQuery(instance);

    await client.query(query, values);
  },

  get: async (
    type: AssetId,
    assetDbId: InstanceId,
  ) => {
    const result = await client.query(
      `
        SELECT *
        FROM "${type}"
        WHERE "asset_db_ID" = $1
      `,
      [assetDbId],
    );

    const row = result.rows[0];

    if (!row) return null;

    const { asset_db_ID, ...properties } = row;

    return {
      asset_db_id: asset_db_ID,
      type,
      properties,
    };
  },
};