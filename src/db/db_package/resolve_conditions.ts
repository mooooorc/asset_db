import type {
  PackageCondition,
  PackageInstance,
} from "../../domain/package.js";
import { db_asset } from "../db_asset/main.js";
import { db_instance } from "../db_instance/main.js";

export const resolve_db_package_condition = async (
  condition: PackageCondition,
): Promise<PackageInstance[]> => {
  const assetIds = await db_asset.getByDefs([condition.definition]);

  const instances = await Promise.all(
    assetIds.map((assetId) =>
      db_instance.getByCondition(
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

export const resolve_db_package_conditions = async (
  conditions: PackageCondition[],
): Promise<PackageInstance[]> => {
  const resolvedConditions = await Promise.all(
    conditions.map(resolve_db_package_condition),
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
