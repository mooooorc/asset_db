import { client } from "../../../db/client.js";
import type { PackageId, PackageInstance } from "../../package.domain.js";

export const remove_instance_from_blacklist = async (
  packageId: PackageId,
  instance: PackageInstance,
): Promise<void> => {
  await client.query(
    `
      DELETE FROM package_blacklist
      WHERE package_id = $1
        AND asset_id = $2
        AND instance_id = $3
    `,
    [packageId, instance.assetId, instance.instanceId],
  );
};