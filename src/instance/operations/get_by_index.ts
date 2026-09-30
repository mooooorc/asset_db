import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { Instance } from "../instance.domain.js";

export const get_instance_by_index = async (
  type: AssetId,
  index: number,
): Promise<Instance | null> => {
  const result = await client.query(
    `
      SELECT *
      FROM "${type}"
      WHERE "index" = $1
    `,
    [index],
  );

  const row = result.rows[0];

  if (!row) return null;

  const { asset_db_ID, index: instanceIndex, ...properties } = row;

  return {
    asset_db_id: asset_db_ID,
    index: instanceIndex,
    type,
    properties,
  };
};