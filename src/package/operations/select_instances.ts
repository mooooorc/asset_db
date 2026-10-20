import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { PackageConditionOperator } from "../package.domain.js";
import type { InstanceService } from "../../instance/instance.service.js";
import type {
  InstanceId,
  InstanceTag,
} from "../../instance/instance.domain.js";
import { find_asset } from "../../asset/operations/find_asset.js";


export const select_instances = (() => {

  const resolve_contains_operator = async (
    asset_id: AssetId,
    instance_id: InstanceId,
    def_id: DefinitionId,
    instanceService: InstanceService,
  ): Promise<InstanceTag[]> => {
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

    const instances = await Promise.all(
      result.rows.map(async (row): Promise<InstanceTag | null> => {
        const isA =
          row.asset_a_id === asset_id && row.instance_a_id === instance_id;

        const relatedAssetId = (
          isA ? row.asset_b_id : row.asset_a_id
        ) as AssetId;
        const relatedInstanceId = (
          isA ? row.instance_b_id : row.instance_a_id
        ) as InstanceId;

        const relatedAssetTag = await find_asset.tag_by_id(relatedAssetId);

        if (!relatedAssetTag) return null;

        const indexResult = await client.query(
          `SELECT "index" FROM "${relatedAssetId}" WHERE id = $1`,
          [relatedInstanceId],
        );

        const index = indexResult.rows[0]?.index;

        if (index == null) return null;

        return {
          assetTag: relatedAssetTag,
          index: Number(index),
        };
      }),
    );

    return ignore_unhealthy(
      instances.filter((tag): tag is InstanceTag => tag !== null),
      instanceService,
    );
  };

  const ignore_unhealthy = async (
    instances: InstanceTag[],
    instanceService: InstanceService,
  ): Promise<InstanceTag[]> => {
    const results = await Promise.all(
      instances.map(async (tag) => {
        const instance = await instanceService.get(tag);

        return instance?.status === "healthy" ? tag : null;
      }),
    );

    return results.filter((tag): tag is InstanceTag => tag !== null);
  };

  return {
    by_condition: async (
      asset_id: AssetId,
      def_id: DefinitionId,
      operator: PackageConditionOperator,
      value: unknown,
      instanceService: InstanceService,
      target_instance_id?: InstanceId,
    ): Promise<InstanceTag[]> => {
      if (operator === "contains") {
        if (!target_instance_id) {
          throw new Error("Target instance ID is required for contains");
        }

        return resolve_contains_operator(
          asset_id,
          target_instance_id,
          def_id,
          instanceService,
        );
      }

      const asset_tag = await find_asset.tag_by_id(asset_id);

      if (!asset_tag) {
        throw new Error(`Asset not found: ${asset_id}`);
      }

      const operators = {
        equal: "=",
        different: "<>",
        greater: ">",
        lower: "<",
      } as const;

      const result = await client.query(
        `
      SELECT "id", "index"
      FROM "${asset_id}"
      WHERE "${def_id}" ${operators[operator]} $1
    `,
        [value],
      );

      const instances: InstanceTag[] = result.rows.map((row) => ({
        assetTag: asset_tag,
        index: Number(row.index),
      }));

      return ignore_unhealthy(instances, instanceService);
    },
  };
})();


