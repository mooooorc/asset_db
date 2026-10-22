import type { InstanceService } from "../../instance/instance.service.js";
import type { DefinitionService } from "../../definition/definition.service.js";

import type {
  ConditionedPackage,
  PackageData,
  PackageId,
  PublicPackage,
} from "../package.domain.js";
import { randomUUID } from "node:crypto";
import { get_package } from "./get_package.js";

export const build_package = {
  self: async (
    data: PackageData,
    definitionService: DefinitionService,
  ): Promise<ConditionedPackage> => {
    const pack: ConditionedPackage = {
      id: randomUUID() as PackageId,
      tag: data.tag,
      name: data.name,
      type: "Conditioned",
      conditions: await Promise.all(
        data.conditions.map(async (condition) => {
          const definition = await definitionService.find_id_by_tag(
            condition.definition,
          );

          if (!definition) {
            throw new Error(`Definition not found: ${condition.definition}`);
          }

          return {
            definition,
            operator: condition.operator,
            value: condition.value,
          };
        }),
      ),
      blacklist: [],
    };

    return pack;
  },

  public: async (
    id: PackageId,
    instanceService: InstanceService,
  ): Promise<PublicPackage | null> => {
    const linked = await get_package.linked(id);
    const conditioned = linked ? null : await get_package.conditioned(id);

    const pack = linked ?? conditioned;

    if (!pack) return null;

    const content = await get_package.content(
      id,
      instanceService,
    );

    const items = Object.values(content).reduce(
      (total, instances) => total + instances.length,
      0,
    );

    return {
      tag: pack.tag,
      name: pack.name,
      items,
      content,
    };
  },
};
