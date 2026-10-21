import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { PackageConditionOperator } from "../package.domain.js";
import type { InstanceService } from "../../instance/instance.service.js";
import type { InstanceId } from "../../instance/instance.domain.js";

export const select_instances = (() => {
  const resolve_contains_operator = async (
    asset_id: AssetId,
    instance_id: InstanceId,
    def_id: DefinitionId,
  ): Promise<InstanceId[]> => {
    const result = await client.query(
      `
      SELECT
        asset_a_id,
        instance_a_id,
        asset_b_id,
        instance_b_id
      FROM instance_relations
      WHERE definition_id = $1
        AND (
          (asset_a_id = $2 AND instance_a_id = $3)
          OR
          (asset_b_id = $2 AND instance_b_id = $3)
        )
    `,
      [def_id, asset_id, instance_id],
    );

    return result.rows.map((row) => {
      const isA =
        row.asset_a_id === asset_id && row.instance_a_id === instance_id;

      return (isA ? row.instance_b_id : row.instance_a_id) as InstanceId;
    });
  };

  const ignore_unhealthy = async (
    instance_ids: InstanceId[],
    instanceService: InstanceService,
  ): Promise<InstanceId[]> => {
    const results = await Promise.all(
      instance_ids.map(async (id) => {
        const asset_id = await instanceService.find_asset_id(id);
        const instance = await instanceService.get_by_id(asset_id, id);

        return instance?.status === "healthy" ? id : null;
      }),
    );

    return results.filter((id): id is InstanceId => id !== null);
  };

  return {
    by_condition: async (
      asset_id: AssetId,
      def_id: DefinitionId,
      operator: PackageConditionOperator,
      value: unknown,
      instanceService: InstanceService,
      target_instance_id?: InstanceId,
    ): Promise<InstanceId[]> => {
      if (operator === "contains") {
        if (!target_instance_id) {
          throw new Error("Target instance ID is required for contains");
        }

        const instances = await resolve_contains_operator(
          asset_id,
          target_instance_id,
          def_id,
        );

        return ignore_unhealthy(instances, instanceService);
      }

      const operators = {
        equal: "=",
        different: "<>",
        greater: ">",
        lower: "<",
      } as const;

      const result = await client.query(
        `
      SELECT "id"
      FROM "${asset_id}"
      WHERE "${def_id}" ${operators[operator]} $1
    `,
        [value],
      );

      const instance_ids: InstanceId[] = result.rows.map(
        (row) => row.id as InstanceId,
      );

      return ignore_unhealthy(instance_ids, instanceService);
    },
  };
})();
