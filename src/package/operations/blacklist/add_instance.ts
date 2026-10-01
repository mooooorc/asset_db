import { client } from "../../../db/client.js";
import type { PackageId, PackageInstance } from "../../package.domain.js";

export const add_instance_to_blacklist = async (
  packageId: PackageId,
  instance: PackageInstance,
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
    [packageId, instance.assetId, instance.instanceId],
  );
};