import { client } from "../../../db/client.js";
import type { PackageId, PackageInstance } from "../../package.domain.js";

export const get_package_blacklist = async (
  packageId: PackageId,
): Promise<PackageInstance[]> => {
  const result = await client.query(
    `
      SELECT asset_id, instance_id
      FROM package_blacklist
      WHERE package_id = $1
    `,
    [packageId],
  );

  return result.rows.map((row) => ({
    assetId: row.asset_id,
    instanceId: row.instance_id,
  }));
};