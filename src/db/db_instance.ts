import { randomUUID } from "node:crypto";
import type { AssetId } from "../domain/asset.js";
import type { Instance, InstanceId } from "../domain/instance.js";
import { client } from "./client.js";
import type { DefinitionId } from "../domain/definition.js";

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
  save: async (
    instance: Omit<Instance, "asset_db_id">,
  ): Promise<Instance> => {
    const newInstance = {
      ...instance,
      asset_db_id: randomUUID() as InstanceId,
    };

    const { query, values } = createInsertQuery(newInstance);

    await client.query(query, values);

    return newInstance;
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

  getAll: async (type: AssetId) => {
    const result = await client.query(
      `
        SELECT *
        FROM "${type}"
      `,
    );

    return result.rows.map((row) => {
      const { asset_db_ID, ...properties } = row;

      return {
        asset_db_id: asset_db_ID,
        type,
        properties,
      };
    });
  },

  getByCondition: async (
  type: AssetId,
  definitionId: DefinitionId,
  value: unknown,
) => {
  const result = await client.query(
    `
      SELECT *
      FROM "${type}"
      WHERE "${definitionId}" = $1
    `,
    [value],
  );

  return result.rows.map((row) => {
    const { asset_db_ID, ...properties } = row;

    return {
      asset_db_id: asset_db_ID,
      type,
      properties,
    };
  });
},
  

  delete: async (
    type: AssetId,
    assetDbId: InstanceId,
  ) => {
    await client.query(
      `
        DELETE FROM "${type}"
        WHERE "asset_db_ID" = $1
      `,
      [assetDbId],
    );
  },
};