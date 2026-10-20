import type { AssetService } from "../../asset/asset.service.js";
import { find_asset } from "../../asset/operations/find_asset.js";
import { find_definition } from "../../definition/operations/find_definition.js";
import type { InstanceService } from "../../instance/instance.service.js";
import type {
  Package,
  PackageData,
  PackageId,
  PublicPackage,
} from "../package.domain.js";
import { randomUUID } from "node:crypto";
import type { PackageService } from "../package.service.js";
import { get_package } from "./get_package.js";



export const build_package = {
  self: async (data: PackageData): Promise<Package> => {
    const pack: Package = {
      id: randomUUID() as PackageId,
      tag: data.tag,
      name: data.name,
      ...(data.linkedAsset
        ? {
            linkedAsset:
              (await find_asset.id_by_tag(data.linkedAsset)) ?? undefined,
          }
        : {}),
      ...(data.conditions
        ? {
            conditions: await Promise.all(
              data.conditions.map(async (condition) => {
                const definition = await find_definition.id_by_tag(
                  condition.definition,
                );

                if (!definition) {
                  throw new Error(
                    `Definition not found: ${condition.definition}`,
                  );
                }

                return {
                  definition,
                  operator: condition.operator,
                  value: condition.value,
                };
              }),
            ),
          }
        : {}),
    };

    return pack;
  },

  public: async (
    id: PackageId,
    assetService: AssetService,
    instanceService: InstanceService,
    packageService: PackageService,
  ): Promise<PublicPackage | null> => {
    const pack = await get_package.self(id);

    if (!pack) return null;

    const content = await get_package.content(
      id,
      assetService,
      instanceService,
      packageService,
    );

    const items = Object.values(content).reduce(
      (total, instances) => total + instances.length,
      0,
    );

    return {
        tag: pack.tag,
        name: pack.name,
        items, 
        content
    }
  },
};

