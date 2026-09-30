import { client } from "../../db/client.js";
import type { Asset } from "../asset.domain.js";

import { map_asset } from "./map.js";

export const get_all_assets = async (): Promise<Asset[]> => {
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

      return map_asset(asset, definitions.rows);
    }),
  );

  return assets;
};