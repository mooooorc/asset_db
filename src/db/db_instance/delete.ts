import type { AssetId } from "../../domain/asset.js";
import type { InstanceId } from "../../domain/instance.js";
import { client } from "../client.js";

export const delete_db_instance = async (type: AssetId, id: InstanceId) => {
  await client.query(
    `
            DELETE FROM "${type}"
            WHERE "asset_db_ID" = $1
          `,
    [id],
  );
};
