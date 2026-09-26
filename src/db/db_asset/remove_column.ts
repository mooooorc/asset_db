import type { AssetId } from "../../domain/asset.js";
import type { DefinitionId } from "../../domain/definition.js";
import { client } from "../client.js";

export const remove_db_asset_column = async (
  assetId: AssetId,
  definitionId: DefinitionId,
) => {
  await client.query(
    `
                ALTER TABLE "${assetId}"
                DROP COLUMN "${definitionId}"
              `,
  );
};
