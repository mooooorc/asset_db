import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { InstanceId } from "../../instance/instance.domain.js";
import type { PackageId } from "../package.domain.js";

export const delete_package = {
  self: async (id: PackageId): Promise<void> => {
    await client.query(
      `
      DELETE FROM packages
      WHERE id = $1
    `,
      [id],
    );
  },

  instance_from_blacklist: async (
    id: PackageId,
    instance_id: InstanceId,
    asset_id: AssetId
  ): Promise<void> => {

    await client.query(
      `
    DELETE FROM package_blacklist
    WHERE package_id = $1
      AND asset_id = $2
      AND instance_id = $3
    `,
      [id, asset_id, instance_id],
    );
  },
};
