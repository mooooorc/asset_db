import { AssetService } from "../../asset/asset.service.js";

import { InstanceService } from "../../instance/instance.service.js";
import type { PackageCondition, PackageInstance } from "../package.domain.js";
import type { PackageService } from "../package.service.js";

export const resolve_package_condition = async (
  condition: PackageCondition,
  assetService: AssetService,
  packageService: PackageService
): Promise<PackageInstance[]> => {
  const assetIds = await assetService.getByDefs([condition.definition]);

  const instances = await Promise.all(
    assetIds.map((assetId) =>
      packageService.selectInstancesByCondition(
        assetId,
        condition.definition,
        condition.operator,
        condition.value,
      ),
    ),
  );

  return instances.flat().map((instance) => ({
    assetId: instance.type,
    instanceId: instance.asset_db_id,
  }));
};

export const resolve_package_conditions = async (
  conditions: PackageCondition[],
  assetService: AssetService,
  packageService: PackageService,
): Promise<PackageInstance[]> => {
  const resolvedConditions = await Promise.all(
    conditions.map((condition) =>
      resolve_package_condition(condition, assetService, packageService),
    ),
  );

  if (resolvedConditions.length === 0) {
    return [];
  }

  return resolvedConditions.reduce((common, instances) =>
    common.filter((instance) =>
      instances.some(
        (candidate) =>
          candidate.assetId === instance.assetId &&
          candidate.instanceId === instance.instanceId,
      ),
    ),
  );
};
