import type { AssetId } from "../../asset/asset.domain.js";

import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { InstanceId } from "../instance.domain.js";
import type { InstanceService } from "../instance.service.js";


export const insert_instance = {

  
  relation: async (
    instance_a_id: InstanceId,
    instance_b_id: InstanceId,
    instance_a_asset_id: AssetId,
    instance_b_asset_id: AssetId,
    def_id: DefinitionId,
    instanceService: InstanceService
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


    const a_instance = await instanceService.get_by_id(firstAssetId, first);
    const b_instance = await instanceService.get_by_id(secondAssetId, second);



    if (!a_instance || !b_instance) {
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
