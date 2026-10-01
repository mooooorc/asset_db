import type { AssetService } from "../../asset/asset.service.js";
import { client } from "../../db/client.js";

import { InstanceService } from "../../instance/instance.service.js";
import type { PackageId, PackageInstance } from "../package.domain.js";
import type { PackageService } from "../package.service.js";
import { get_package_blacklist } from "./blacklist/get.js";
import { get_package } from "./get.js";
import { resolve_package_conditions } from "./resolve_conditions.js";

const get_package_raw_instances = async (
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

export const get_package_instances = async (
  packageId: PackageId,
  assetService: AssetService,
  instanceService: InstanceService,
  packageService: PackageService,
): Promise<PackageInstance[]> => {
  const pack = await get_package(packageId);

  if (!pack) {
    return [];
  }

  const raw_instances = await get_package_raw_instances(packageId);

  const linkedInstances = pack.linkedAsset
    ? await instanceService.getAll(pack.linkedAsset)
    : [];

  const linkedPackageInstances = linkedInstances.map((instance) => ({
    assetId: instance.type,
    instanceId: instance.asset_db_id,
  }));

  const conditionInstances = pack.conditions?.length
    ? await resolve_package_conditions(
        pack.conditions,
        assetService,
        packageService,
      )
    : [];

  const instances = [
    ...raw_instances,
    ...linkedPackageInstances,
    ...conditionInstances,
  ];

  const uniqueInstances = Array.from(
    new Map(
      instances.map((instance) => [
        `${instance.assetId}:${instance.instanceId}`,
        instance,
      ]),
    ).values(),
  );

  const blacklist = await get_package_blacklist(packageId);

  return uniqueInstances.filter(
    (instance) =>
      !blacklist.some(
        (blacklisted) =>
          blacklisted.assetId === instance.assetId &&
          blacklisted.instanceId === instance.instanceId,
      ),
  );
};
