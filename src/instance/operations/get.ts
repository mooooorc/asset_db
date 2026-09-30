import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { Instance, InstanceId } from "../instance.domain.js";
import { get_relations } from "./get_relations.js";

export const get_instance = async (
  type: AssetId,
  id: InstanceId,
): Promise<Instance | null> => {
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

  const { asset_db_ID, index, ...properties } = row;

  const relations = await get_relations(
    type,
    asset_db_ID,
  );

  return {
    asset_db_id: asset_db_ID,
    index,
    type,
    properties: {
      ...properties,
      ...relations,
    },
  };
};
