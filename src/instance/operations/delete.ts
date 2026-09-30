import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { InstanceId } from "../instance.domain.js";


export const delete_instance = async (type: AssetId, id: InstanceId) => {
  await client.query(
    `
            DELETE FROM "${type}"
            WHERE "asset_db_ID" = $1
          `,
    [id],
  );
};
