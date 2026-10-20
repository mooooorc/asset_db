import type { AssetTag } from "../../asset/asset.domain.js";
import { find_asset } from "../../asset/operations/find_asset.js";
import { client } from "../../db/client.js";
import type { InstanceId } from "../../instance/instance.domain.js";
import { find_instance } from "../../instance/operations/find_instance.js";
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
    instanceId: InstanceId,
    assetTag: AssetTag,
  ): Promise<void> => {
    const asset_id = await find_asset.id_by_tag(assetTag);

    if (!asset_id) {
      throw new Error(`Asset not found: ${assetTag}`);
    }

    const instance = await find_instance.by_id(instanceId, asset_id);

    if (!instance) {
      throw new Error(`Instance not found: ${assetTag}:${instanceId}`);
    }

    await client.query(
      `
    DELETE FROM package_blacklist
    WHERE package_id = $1
      AND asset_id = $2
      AND instance_id = $3
    `,
      [id, asset_id, instanceId],
    );
  },
};
