import type { PackageId, PackageInstance } from "../../domain/package.js";
import { client } from "../client.js";
import { db_package } from "./main.js";
import { get_db_package } from "./get.js";
import { resolve_db_package_condition } from "./resolve_condition.js";

const get_db_package_raw_instances = async (
  packageId: PackageId,
): Promise<PackageInstance[]> => {
  const result = await client.query(
    `
      SELECT asset_id, instance_id
      FROM package_instances
      WHERE package_id = $1
    `,
    [packageId],
  );

  return result.rows.map((row) => ({
    assetId: row.asset_id,
    instanceId: row.instance_id,
  }));
};

export const get_db_package_instances = async ( packageId: PackageId ): Promise<PackageInstance[]> => {

    const pack = await get_db_package(packageId);
    
        if (!pack) {
          return [];
        }
    
        const raw_instances = await get_db_package_raw_instances(packageId);
    
        if (!pack.condition) {
          return raw_instances;
        }
    
        const conditionInstances = await resolve_db_package_condition(pack.condition);
    
        const instances = [...raw_instances, ...conditionInstances];
    
        return Array.from(
          new Map(
            instances.map((instance) => [
              `${instance.assetId}:${instance.instanceId}`,
              instance,
            ]),
          ).values(),
        );
      }

