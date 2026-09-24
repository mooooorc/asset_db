import pg from "pg";
import type { Asset, AssetId } from "../asset.js";

const { Client } = pg;

const client = new Client({
  host: "localhost",
  port: 5434,
  user: "assetdb",
  password: "assetdb",
  database: "assetdb",
});

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
        definitions: definitions.rows.map(
          (row) => row.definition_id,
        ),
      };
    } finally {
      await client.end();
    }
  },
};