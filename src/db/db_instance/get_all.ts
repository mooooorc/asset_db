import type { AssetId } from "../../domain/asset.js";
import { client } from "../client.js";

export const get_all_db_instances = async (type: AssetId) => {
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
};
