import type { AssetId } from "../../domain/asset.js";
import { client } from "../client.js";

export const get_db_asset = async (id: AssetId) => {
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
};
