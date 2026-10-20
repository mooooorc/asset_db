import { find_asset } from "../../asset/operations/find_asset.js";
import { client } from "../../db/client.js";

import type { InstanceId, InstanceTag } from "../instance.domain.js";
import { find_instance } from "./find_instance.js";

export const delete_instance = {
  self: async (tag: InstanceTag): Promise<void> => {
    const assetId = await find_asset.id_by_tag(tag.assetTag);

    if (!assetId) {
      throw new Error(`Asset not found: ${tag.assetTag}`);
    }

    const instanceId = await find_instance.id_by_tag(tag);

    if (!instanceId) {
      throw new Error(`Instance not found: ${tag.assetTag}#${tag.index}`);
    }

    await client.query(
      `
      DELETE FROM "${assetId}"
      WHERE "id" = $1
    `,
      [instanceId],
    );
  },

  issues: async (id: InstanceId) => {
    await client.query(
      `DELETE FROM healthy_issues
     WHERE instance_id = $1`,
      [id],
    );
  },
};
