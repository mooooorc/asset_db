import type { AssetId } from "../../domain/asset.js";
import type { InstanceId } from "../../domain/instance.js";
import { client } from "../client.js";

export const get_db_instance = async (type: AssetId, id: InstanceId) => {
  const result = await client.query(
    `
            SELECT *
            FROM "${type}"
            WHERE "asset_db_ID" = $1
          `,
    [id],
  );

  const row = result.rows[0];

  if (!row) return null;

  const { asset_db_ID, ...properties } = row;

  return {
    asset_db_id: asset_db_ID,
    type,
    properties,
  };
};
