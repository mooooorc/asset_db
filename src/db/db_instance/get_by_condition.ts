import type { AssetId } from "../../domain/asset.js";
import type { DefinitionId } from "../../domain/definition.js";
import type { PackageConditionOperator } from "../../domain/package.js";
import { client } from "../client.js";

export const get_db_instance_by_condition = async (
  type: AssetId,
  definitionId: DefinitionId,
  operator: PackageConditionOperator,
  value: unknown,
) => {

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
