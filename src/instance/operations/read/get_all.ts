import type { AssetId } from "../../../asset/asset.domain.js";
import { client } from "../../../db/client.js";
import type { Instance, InstanceId } from "../../instance.domain.js";
import { get_instance_issues } from "./get_issues.js";
import { get_relations } from "./get_relations.js";


export const get_all_instances = async (
  type: AssetId,
): Promise<Instance[]> => {
  const result = await client.query(
    `
      SELECT *
      FROM "${type}"
    `,
  );

  return Promise.all(
    result.rows.map(async (row) => {
      const { asset_db_ID, index, ...properties } = row;

      const relations = await get_relations(
        type,
        asset_db_ID as InstanceId,
      );

      const issues = await get_instance_issues(asset_db_ID)

      return {
        asset_db_id: asset_db_ID,
        index,
        type,
        properties: {
          ...properties,
          ...relations,
        },
        status: issues.length === 0 ? "healthy" : "unhealthy"
      };
    }),
  );
};