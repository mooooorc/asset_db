import type { Asset, AssetId, NewAsset } from "../domain/asset.js";
import { client } from "./client.js";
import type { Definition, DefinitionId } from "../domain/definition.js";
import { db_definition } from "./db_definition.js";
import { randomUUID } from "node:crypto";

type Column = {
  name: string;
  type: string;
};

const createAssetTable = async (asset: Asset, columns: Column[]) => {
  const columnDefinitions = columns
    .map((column) => `"${column.name}" ${column.type}`)
    .join(",\n");

  await client.query(`
    CREATE TABLE "${asset.id}" (
      "asset_db_ID" TEXT PRIMARY KEY${
        columnDefinitions ? `,\n${columnDefinitions}` : ""
      }
    )
  `);
};

export const getColumns = async (definition: Definition): Promise<Column[]> => {
  if ("valueType" in definition) {
    return [
      {
        name: definition.id,
        type:
          definition.valueType === "string"
            ? "TEXT"
            : definition.valueType === "number"
              ? "DOUBLE PRECISION"
              : "BOOLEAN",
      },
    ];
  }

  const definitions = await Promise.all(
    definition.definitions.map((definitionId) =>
      db_definition.get(definitionId),
    ),
  );

  const columns = await Promise.all(
    definitions
      .filter((definition): definition is Definition => definition !== null)
      .map(getColumns),
  );

  return columns.flat();
};

export const db_asset = {
  save: async (asset: NewAsset): Promise<Asset> => {
  const newAsset = {
    ...asset,
    id: randomUUID() as AssetId,
  };

  await client.query(
    `
      INSERT INTO assets (id, name)
      VALUES ($1, $2)
    `,
    [newAsset.id, newAsset.name],
  );

  for (const definitionId of newAsset.definitions) {
    await client.query(
      `
        INSERT INTO asset_definitions (asset_id, definition_id)
        VALUES ($1, $2)
      `,
      [newAsset.id, definitionId],
    );
  }

  const definitions = await Promise.all(
    newAsset.definitions.map((definitionId) =>
      db_definition.get(definitionId),
    ),
  );

  const columns = (
    await Promise.all(
      definitions
        .filter(
          (definition): definition is Definition =>
            definition !== null,
        )
        .map(getColumns),
    )
  ).flat();

  await createAssetTable(newAsset, columns);

  return newAsset;
},

  get: async (id: AssetId) => {
    const result = await client.query(
      `
        SELECT id, name
        FROM assets
        WHERE id = $1
      `,
      [id],
    );

    const asset = result.rows[0];

    if (!asset) return null;

    const definitions = await client.query(
      `
        SELECT definition_id
        FROM asset_definitions
        WHERE asset_id = $1
      `,
      [id],
    );

    return {
      id: asset.id,
      name: asset.name,
      definitions: definitions.rows.map((row) => row.definition_id),
    };
  },

  delete: async (id: AssetId) => {
    await client.query(`
    DROP TABLE "${id}"
  `);

    await client.query(
      `
      DELETE FROM asset_definitions
      WHERE asset_id = $1
    `,
      [id],
    );

    await client.query(
      `
      DELETE FROM assets
      WHERE id = $1
    `,
      [id],
    );
  },

  getByDefinitions: async (definitionIds: DefinitionId[]) => {
    const result = await client.query(
      `
      SELECT DISTINCT asset_id
      FROM asset_definitions
      WHERE definition_id = ANY($1)
    `,
      [definitionIds],
    );

    return result.rows.map((row) => row.asset_id as AssetId);
  },

  removeColumn: async (
  assetId: AssetId,
  definitionId: DefinitionId,
) => {
  await client.query(
    `
      ALTER TABLE "${assetId}"
      DROP COLUMN "${definitionId}"
    `,
  );
},
};
