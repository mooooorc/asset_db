import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { InstanceId } from "../../instance/instance.domain.js";

export const persist_instance = {
  relation: async (
    definition_id: DefinitionId,
    asset_a_id: AssetId,
    asset_b_id: AssetId,
    instance_a_id: InstanceId,
    instance_b_id: InstanceId,
  ) => {
    const instance_a_uuid = instance_a_id.split("/")[1];
    const instance_b_uuid = instance_b_id.split("/")[1];

    await client.query(
      `
              INSERT INTO instance_relations (
                definition_id,
                asset_a_id,
                instance_a_id,
                asset_b_id,
                instance_b_id
              )
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT DO NOTHING
              `,
      [definition_id, asset_a_id, instance_a_uuid, asset_b_id, instance_b_uuid],
    );
  },

  issue: async (id: InstanceId, code: number, field: string) => {
    await client.query(
      `INSERT INTO healthy_issues (instance_id, issue_code, field)
     VALUES ($1, $2, $3)
     ON CONFLICT (instance_id, issue_code, field) DO NOTHING`,
      [id, code, field],
    );
  },
};
