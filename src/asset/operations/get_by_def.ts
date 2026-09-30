import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { AssetId } from "../asset.domain.js";


export const get_assets_by_def = async (ids: DefinitionId[]) => {
  const result = await client.query(
    `
            SELECT DISTINCT asset_id
            FROM asset_definitions
            WHERE definition_id = ANY($1)
          `,
    [ids],
  );

  return result.rows.map((row) => row.asset_id as AssetId);
};