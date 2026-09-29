import type { AssetId } from "../../domain/asset.js";
import { client } from "../client.js";
import { map_db_asset } from "./map.js";



export const get_db_asset = async (id: AssetId) => {
  const result = await client.query(
    `
      SELECT id, name, expose_as_package
      FROM assets
      WHERE id = $1
    `,
    [id],
  );

  const asset = result.rows[0];

  if (!asset) return null;

  const definitions = await client.query(
    `
      SELECT definition_id, required, identifiable
      FROM asset_definitions
      WHERE asset_id = $1
    `,
    [id],
  );

  return map_db_asset(asset, definitions.rows);
};
