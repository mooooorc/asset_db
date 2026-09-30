import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { Instance } from "../instance.domain.js";


export const get_all_instances = async (type: AssetId): Promise<Instance[]> => {
  const result = await client.query(
    `
            SELECT *
            FROM "${type}"
          `,
  );

  return result.rows.map((row) => {
    const { asset_db_ID, index, ...properties } = row;

    return {
      asset_db_id: asset_db_ID,
      index,
      type,
      properties,
    };
  });
};
