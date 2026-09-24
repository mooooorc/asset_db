import type { Asset, AssetId } from "../domain/asset.js";
import { client } from "./client.js";
import type { Definition } from "../domain/definition.js";
import { db_definition } from "./db_definition.js";

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
}

export const getColumns = (definition: Definition): Column[] => {
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

  return definition.definitions.flatMap(getColumns);
}

export const db_asset = {
  save: async (asset: Asset) => {
    await client.connect();

    try {
      await client.query(
        `
        INSERT INTO assets (id)
        VALUES ($1)
      `,
        [asset.id],
      );

      for (const definitionId of asset.definitions) {
        await client.query(
          `
          INSERT INTO asset_definitions (asset_id, definition_id)
          VALUES ($1, $2)
        `,
          [asset.id, definitionId],
        );
      }

      const definitions = await Promise.all(
        asset.definitions.map((definitionId) =>
          db_definition.get(definitionId),
        ),
      );

      const columns = definitions
        .filter((definition): definition is Definition => definition !== null)
        .flatMap(getColumns);

      await createAssetTable(asset, columns);
    } finally {
      await client.end();
    }
  },

  get: async (id: AssetId) => {
    await client.connect();

    try {
      const result = await client.query(
        `
          SELECT id
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
        definitions: definitions.rows.map((row) => row.definition_id),
      };
    } finally {
      await client.end();
    }
  },
};
