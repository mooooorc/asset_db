import type { AssetId } from "../../domain/asset.js";
import type { DefinitionId } from "../../domain/definition.js";
import { client } from "../client.js";

export const get_db_asset_by_def = async (ids: DefinitionId[]) => {
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
