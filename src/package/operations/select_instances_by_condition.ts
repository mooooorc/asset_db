import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { PackageConditionOperator, PackageInstance } from "../package.domain.js";
import type { InstanceService } from "../../instance/instance.service.js";
import { parse_instance_reference } from "../../instance/operations/parse_reference.js";

export const ignore_unhealthy_instances = async (
  instances: PackageInstance[],
  instanceService: InstanceService,
): Promise<PackageInstance[]> => {
  const results = await Promise.all(
    instances.map(async (instance) => {
      const result = await instanceService.get(
        instance.assetId,
        instance.instanceId,
      );

      return result?.status === "healthy" ? instance : null;
    }),
  );

  return results.filter(
    (instance): instance is PackageInstance => instance !== null,
  );
};


const resolve_contains_operator = async (
  type: AssetId,
  value: unknown,
  instanceService: InstanceService,
  definitionId: DefinitionId,
) => {
  const ref = parse_instance_reference(value as string);

  const target = await instanceService.getByIndex(ref.assetId, ref.index);

  if (!target) return [];

  const result = await client.query(
    `
      SELECT
        CASE
          WHEN asset_a_id = $1 AND instance_a_id = $2
            THEN asset_b_id
          ELSE asset_a_id
        END AS asset_id,
        CASE
          WHEN asset_a_id = $1 AND instance_a_id = $2
            THEN instance_b_id
          ELSE instance_a_id
        END AS instance_id
      FROM instance_relations
      WHERE definition_id = $3
        AND (
          (asset_a_id = $1 AND instance_a_id = $2)
          OR
          (asset_b_id = $1 AND instance_b_id = $2)
        )
    `,
    [target.type, target.asset_db_id, definitionId],
  );

  const instances: PackageInstance[] = result.rows
    .filter((row) => row.asset_id === type)
    .map((row) => ({
      assetId: row.asset_id,
      instanceId: row.instance_id,
    }));

  return ignore_unhealthy_instances(instances, instanceService);
};

export const select_instance_by_condition = async (
  type: AssetId,
  definitionId: DefinitionId,
  operator: PackageConditionOperator,
  value: unknown,
  instanceService: InstanceService,
) => {
  if (operator === "contains") {
    return resolve_contains_operator(
      type,
      value,
      instanceService,
      definitionId,
    );
  }

  const operators = {
    equal: "=",
    different: "<>",
    greater: ">",
    lower: "<",
  } as const;

  const result = await client.query(
    `
      SELECT *
      FROM "${type}"
      WHERE "${definitionId}" ${operators[operator]} $1
    `,
    [value],
  );

  const instances: PackageInstance[] = result.rows.map((row) => ({
    assetId: type,
    instanceId: row.asset_db_ID,
  }));

  return ignore_unhealthy_instances(instances, instanceService);
};
