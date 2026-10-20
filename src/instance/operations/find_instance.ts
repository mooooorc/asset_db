import type { AssetId, AssetTag } from "../../asset/asset.domain.js";
import { find_asset } from "../../asset/operations/find_asset.js";
import { client } from "../../db/client.js";
import type { Instance, InstanceId, InstanceTag } from "../instance.domain.js";
import { get_instance } from "./get_instance.js";
import { map_property_tags } from "./utils/map_property_tags.js";

export const find_instance = {
  by_id: async (id: InstanceId, assetId: AssetId): Promise<Instance | null> => {
    const result = await client.query(
      `SELECT * FROM "${assetId}" WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];

    if (!row) return null;

    const { id: _id, index, ...properties } = row;

    const assetTag = await find_asset.tag_by_id(assetId);
    if (!assetTag) return null;

    const [relations, issues] = await Promise.all([
      get_instance.relations(assetId, id),
      get_instance.issues(id),
    ]);

    return {
      id,
      asset: assetId,
      tag: {
        assetTag,
        index: Number(index),
      },
      properties: await map_property_tags({
        ...properties,
        ...relations,
      }),
      status: issues.length === 0 ? "healthy" : "unhealthy",
    };
  },

  /*
  index_by_id: async (asset: AssetTag, id: InstanceId): Promise<number | null> => {
    
    const result = await client.query(
      `SELECT "index" FROM "${asseId}" WHERE id = $1`,
      [id],
    );

    return result.rows[0]?.index ?? null;
  },
  */

  id_by_tag: async (tag: InstanceTag): Promise<InstanceId | null> => {
    const assetId = await find_asset.id_by_tag(tag.assetTag);

    if (!assetId) return null;

    const result = await client.query(
      `SELECT id FROM "${assetId}" WHERE "index" = $1`,
      [tag.index],
    );

    return result.rows[0]?.id ?? null;
  },
};
