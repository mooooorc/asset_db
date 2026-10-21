import type { AssetId } from "../../asset/asset.domain.js";

import { client } from "../../db/client.js";
import type {
  Instance,
  InstanceId,
} from "../../instance/instance.domain.js";

import type { PackageId } from "../package.domain.js";

export const add_instance = {
  to_package: async (
    package_id: PackageId,
    asset_id: AssetId,
    id: InstanceId,
    status: Instance["status"],
  ): Promise<void> => {
    if (status === "unhealthy") {
      throw new Error("Cannot add an unhealthy instance to a package");
    }

    await client.query(
      `
      INSERT INTO package_instances (
        package_id,
        asset_id,
        instance_id
      )
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `,
      [package_id, asset_id, id],
    );
  },

  to_blacklist: async (
    package_id: PackageId,
    instance_id: InstanceId,
    asset_id: AssetId,
  ): Promise<void> => {

    

    await client.query(
      `
      INSERT INTO package_blacklist (
        package_id,
        asset_id,
        instance_id
      )
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `,
      [package_id, asset_id, instance_id],
    );
  },
};
