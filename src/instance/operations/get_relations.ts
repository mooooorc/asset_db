import { client } from "../../db/client.js";
import type { AssetId } from "../../asset/asset.domain.js";
import type { InstanceId } from "../instance.domain.js";

export const get_relations = async (
  assetId: AssetId,
  instanceId: InstanceId,
): Promise<Record<string, string[]>> => {
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
    [assetId, instanceId],
  );

  const relations: Record<string, string[]> = {};

  for (const row of result.rows) {
    const isA = row.asset_a_id === assetId && row.instance_a_id === instanceId;

    const targetAssetId = (isA ? row.asset_b_id : row.asset_a_id) as AssetId;

    const targetInstanceId = (
      isA ? row.instance_b_id : row.instance_a_id
    ) as InstanceId;

    const target = await client.query(
      `
        SELECT "index"
        FROM "${targetAssetId}"
        WHERE "asset_db_ID" = $1
      `,
      [targetInstanceId],
    );

    const targetRow = target.rows[0];

    if (!targetRow) {
      continue;
    }

    const definitionRelations = relations[row.definition_id] ?? [];

    definitionRelations.push(`${targetAssetId}#${targetRow.index}`);

    relations[row.definition_id] = definitionRelations;
  }

  return relations;
};
