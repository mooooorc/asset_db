import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { AssetId } from "../asset.domain.js";


export const remove_asset_column = async (
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
