import type { AssetId } from "../../domain/asset.js";
import { client } from "../client.js";

export const delete_db_asset = async (id: AssetId) => {
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
};
