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
};

export const getColumns = async (
  definition: Definition,
): Promise<Column[]> => {
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
      .filter(
        (definition): definition is Definition =>
          definition !== null,
      )
      .map(getColumns),
  );

  return columns.flat();
};

export const db_asset = {
  save: async (asset: Asset) => {
    await client.query(
      `
        INSERT INTO assets (id, name)
        VALUES ($1, $2)
      `,
      [asset.id, asset.name],
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

    await createAssetTable(asset, columns);
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
      definitions: definitions.rows.map(
        (row) => row.definition_id,
      ),
    };
  },
};