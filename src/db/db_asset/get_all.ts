import type { Asset } from "../../domain/asset.js";
import { client } from "../client.js";
import { map_db_asset } from "./map.js";

export const get_all_db_assets = async (): Promise<Asset[]> => {
  const result = await client.query(
    `
      SELECT id, name, expose_as_package
      FROM assets
    `,
  );

  const assets = await Promise.all(
    result.rows.map(async (asset) => {
      const definitions = await client.query(
        `
          SELECT definition_id, required, identifiable
          FROM asset_definitions
          WHERE asset_id = $1
        `,
        [asset.id],
      );

      return map_db_asset(asset, definitions.rows);
    }),
  );

  return assets;
};