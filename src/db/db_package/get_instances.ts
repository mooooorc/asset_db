import type { PackageId, PackageInstance } from "../../domain/package.js";
import { client } from "../client.js";
import { db_instance } from "../db_instance/main.js";
import { get_db_package } from "./get.js";
import { resolve_db_package_conditions } from "./resolve_conditions.js";

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

export const get_db_package_instances = async (
  packageId: PackageId,
): Promise<PackageInstance[]> => {
  const pack = await get_db_package(packageId);

  if (!pack) {
    return [];
  }

  const raw_instances = await get_db_package_raw_instances(packageId);

  const linkedInstances = pack.linkedAsset
    ? await db_instance.getAll(pack.linkedAsset)
    : [];

  const linkedPackageInstances = linkedInstances.map((instance) => ({
    assetId: instance.type,
    instanceId: instance.asset_db_id,
  }));

  const conditionInstances = pack.conditions?.length
    ? await resolve_db_package_conditions(pack.conditions)
    : [];

  const instances = [
    ...raw_instances,
    ...linkedPackageInstances,
    ...conditionInstances,
  ];

  return Array.from(
    new Map(
      instances.map((instance) => [
        `${instance.assetId}:${instance.instanceId}`,
        instance,
      ]),
    ).values(),
  );
};
