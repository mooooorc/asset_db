import type { PackageId, PackageInstance } from "../../domain/package.js";
import { client } from "../client.js";

export const add_instance_to_db_package = async (
  packageId: PackageId,
  instance: PackageInstance,
): Promise<void> => {

     await client.query(
          `
          INSERT INTO package_instances (
            package_id,
            asset_id,
            instance_id
          )
          VALUES ($1, $2, $3)
        `,
          [packageId, instance.assetId, instance.instanceId],
        );
};
