import type { Asset } from "../../domain/asset.js";
import type { Definition } from "../../domain/definition.js";
import type { PackageId } from "../../domain/package.js";
import { client } from "../client.js";
import { db_definition } from "../db_def/main.js";
import { save_db_package } from "../db_package/save.js";
import { create_asset_table } from "./create_asset_table.js";
import { getColumns } from "./get_columns.js";

export const save_db_asset = async (asset: Asset): Promise<Asset> => {
  await client.query("BEGIN");

  try {
    await client.query(
      `
        INSERT INTO assets (id, name, expose_as_package)
        VALUES ($1, $2, $3)
      `,
      [asset.id, asset.name, asset.exposeAsPackage ?? false],
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
      asset.definitions.map((definitionId) => db_definition.get(definitionId)),
    );

    const columns = (
      await Promise.all(
        definitions
          .filter((definition): definition is Definition => definition !== null)
          .map(getColumns),
      )
    ).flat();

    await create_asset_table(asset, columns);

   

    if (asset.exposeAsPackage) {
      await save_db_package({
        id: asset.id as unknown as PackageId,
        name: asset.name,
        linkedAsset: asset.id
      });
    }

    await client.query("COMMIT");

    return asset;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};
