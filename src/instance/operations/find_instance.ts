import type { AssetId } from "../../asset/asset.domain.js";
import type { AssetService } from "../../asset/asset.service.js";

import { client } from "../../db/client.js";

import type { InstanceId, InstanceTag } from "../instance.domain.js";

export const find_instance = {
  id_by_tag: async (
    tag: InstanceTag,
    assetService: AssetService,
  ): Promise<InstanceId | null> => {
    const asset_id = await assetService.find_id_by_tag(tag.assetTag);

    if (!asset_id) return null;

    const result = await client.query(
      `SELECT id FROM "${asset_id}" WHERE "index" = $1`,
      [tag.index],
    );

    return result.rows[0]?.id ?? null;
  },
  

  asset_id(id: InstanceId): AssetId {
    return id.split("/")[0] as AssetId;
  },


};
