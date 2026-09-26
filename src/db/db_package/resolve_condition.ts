import type { PackageCondition, PackageInstance } from "../../domain/package.js";
import { db_asset } from "../db_asset/main.js";
import { db_instance } from "../db_instance/main.js";

export const resolve_db_package_condition = async (condition: PackageCondition): Promise<PackageInstance[]>=> {

    const assetIds = await db_asset.getByDefs([condition.definition]);
    
        const instances = await Promise.all(
          assetIds.map((assetId) =>
            db_instance.getByCondition(
              assetId,
              condition.definition,
              condition.value,
            ),
          ),
        );
    
        return instances.flat().map((instance) => ({
          assetId: instance.type,
          instanceId: instance.asset_db_id,
        }));
}