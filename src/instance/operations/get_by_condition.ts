import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { PackageConditionOperator } from "../../package/package.domain.js";
import type { InstanceService } from "../instance.service.js";
import { parse_instance_reference } from "./parse_reference.js";

const resolve_contains_operator =  async (
  type: AssetId,
  value: unknown,
  instanceService: InstanceService,
  definitionId: DefinitionId
) => {
  const ref = parse_instance_reference(value as string);

  const target = await instanceService.getByIndex(ref.assetId, ref.index)

  if (!target) return []

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
      [
        target.type,
        target.asset_db_id,
        definitionId,
      ],
    );

    return result.rows
      .filter((row) => row.asset_id === type)
      .map((row) => ({
        asset_db_id: row.instance_id,
        type,
        properties: {},
      }));


}


export const get_instance_by_condition = async (
  type: AssetId,
  definitionId: DefinitionId,
  operator: PackageConditionOperator,
  value: unknown,
  instanceService: InstanceService,
) => {
  if (operator === "contains") {
   return resolve_contains_operator(type, value, instanceService, definitionId)
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

  return result.rows.map((row) => {
    const { asset_db_ID, ...properties } = row;

    return {
      asset_db_id: asset_db_ID,
      type,
      properties,
    };
  });
};
