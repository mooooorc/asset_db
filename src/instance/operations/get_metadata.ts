import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { InstanceId } from "../instance.domain.js";

export const get_metadata = {
 
  issues: async (id: InstanceId) => {
    const result = await client.query(
      `
        SELECT issue_code, field
        FROM healthy_issues
        WHERE instance_id = $1
        `,
      [id],
    );

    return result.rows;
  },

  relations: async (
  assetId: AssetId,
  id: InstanceId,
): Promise<Record<string, string[]>> => {
  const instanceUuid = id.split("/")[1];

  const result = await client.query(
    `
    SELECT
      definition_id,
      asset_a_id,
      instance_a_id,
      asset_b_id,
      instance_b_id
    FROM instance_relations
    WHERE
      (asset_a_id = $1 AND instance_a_id = $2)
      OR
      (asset_b_id = $1 AND instance_b_id = $2)
    `,
    [assetId, instanceUuid],
  );

  const relations: Record<string, string[]> = {};

  for (const row of result.rows) {
    const isA =
      row.asset_a_id === assetId &&
      row.instance_a_id === instanceUuid;

    const targetAssetId = (isA ? row.asset_b_id : row.asset_a_id) as AssetId;
    const targetInstanceUuid = isA
      ? row.instance_b_id
      : row.instance_a_id;

    const indexResult = await client.query(
      `SELECT "index" FROM "${targetAssetId}" WHERE id = $1`,
      [targetInstanceUuid],
    );

    const index = indexResult.rows[0]?.index;

    if (index == null) continue;

    const definitionRelations = relations[row.definition_id] ?? [];
    definitionRelations.push(`${targetAssetId}:${Number(index)}`);
    relations[row.definition_id] = definitionRelations;
  }

  return relations;
}
};