import type { Asset } from "../../domain/asset.js";
import type { Definition } from "../../domain/definition.js";
import { client } from "../client.js";

import { db_definition } from "../db_def/main.js";
import { createAssetTable } from "./create_asset_table.js";
import { getColumns } from "./get_columns.js";

export const save_db_asset = async (asset: Asset): Promise<Asset> => {
  await client.query(
    `
        INSERT INTO assets (id, name)
        VALUES ($1, $2)
      `,
    [asset.id, asset.name],
  );

  for (const definitionId of asset.definitions) {
    await client.query(
      `
          INSERT INTO asset_definitions (asset_id, definition_id)
          VALUES ($1, $2)
        `,
      [asset.id, definitionId],
    );
  }

    const definitions = await Promise.all(
        asset.definitions.map((definitionId) =>
          db_definition.get(definitionId),
        ),
      );
  
      const columns = (
        await Promise.all(
          definitions
            .filter(
              (definition): definition is Definition =>
                definition !== null,
            )
            .map(getColumns),
        )
      ).flat();
  
      await createAssetTable(asset, columns);
  
      return asset;
};
