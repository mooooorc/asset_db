import { client } from "../../db/client.js";
import type { AssetId, AssetTag } from "../asset.domain.js";


export const find_asset = {
  id_by_tag: async (tag: AssetTag): Promise<AssetId | null> => {
    const result = await client.query(`SELECT id FROM assets WHERE tag = $1`, [
      tag,
    ]);

    return result.rows[0]?.id ?? null;
  },

  tag_by_id: async (id: AssetId): Promise<AssetTag | null> => {
    const result = await client.query(`SELECT tag FROM assets WHERE id = $1`, [
      id,
    ]);

    return result.rows[0]?.tag ?? null;
  },
};
