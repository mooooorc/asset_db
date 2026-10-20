import type { AssetId } from "../../asset/asset.domain.js";
import { find_asset } from "../../asset/operations/find_asset.js";
import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { InstanceId } from "../instance.domain.js";
import { find_instance } from "./find_instance.js";


export const insert_instance = {
  relation: async (
    instance_a_id: InstanceId,
    instance_b_id: InstanceId,
    instance_a_asset_id: AssetId,
    instance_b_asset_id: AssetId,
    def_id: DefinitionId,
  ): Promise<void> => {
    if (instance_a_id === instance_b_id) return;

    const [first, second, firstAssetId, secondAssetId] =
      instance_a_id < instance_b_id
        ? [
            instance_a_id,
            instance_b_id,
            instance_a_asset_id,
            instance_b_asset_id,
          ]
        : [
            instance_b_id,
            instance_a_id,
            instance_b_asset_id,
            instance_a_asset_id,
          ];

    const firstInstance = await find_instance.by_id(first, firstAssetId);
    const secondInstance = await find_instance.by_id(second, secondAssetId);

    if (!firstInstance || !secondInstance) {
      throw new Error("Instance not found");
    }

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
      [def_id, firstAssetId, first, secondAssetId, second],
    );
  },
};

