import type { Asset } from "../../domain/asset.js";
import type { Definition } from "../../domain/definition.js";
import type { PackageId } from "../../domain/package.js";
import { client } from "../client.js";
import { db_definition } from "../db_def/main.js";
import { insert_db_package } from "../db_package/save.js";
import { create_asset_table } from "./create_asset_table.js";
import { get_columns } from "./get_columns.js";

export const insert_db_asset_definitions = async (asset: Asset) => {
  for (const definition of asset.definitions) {
    await client.query(
      `
      INSERT INTO asset_definitions (
        asset_id,
        definition_id,
        required,
        identifiable
      )
      VALUES ($1, $2, $3, $4)
    `,
      [
        asset.id,
        definition.definition,
        definition.required ?? false,
        definition.identifiable ?? false,
      ],
    );
  }
};

export const insert_db_instance_counters = async (asset: Asset) => {
  await client.query(
    `
    INSERT INTO instance_counters (asset_id)
    VALUES ($1)
    `,
    [asset.id]
  )
}

export const insert_db_asset = async (asset: Asset) => {
  await client.query(
    ` 
      INSERT INTO assets (id, name, expose_as_package)
      VALUES ($1, $2, $3)
    `,
    [asset.id, asset.name, asset.exposeAsPackage ?? false]
  )
}

export const save_db_asset = async (asset: Asset): Promise<Asset> => {
  await client.query("BEGIN");

  try {
    
    await insert_db_asset(asset)
    await insert_db_instance_counters(asset)
    await insert_db_asset_definitions(asset)

    const definitions = await Promise.all(
      asset.definitions.map((asset_def) =>
        db_definition.get(asset_def.definition),
      ),
    );

    const columns = (
      await Promise.all(
        definitions
          .filter((definition): definition is Definition => definition !== null)
          .map(get_columns),
      )
    ).flat();

    await create_asset_table(asset, columns);

    if (asset.exposeAsPackage) {
      await insert_db_package({
        id: asset.id as unknown as PackageId,
        name: asset.name,
        linkedAsset: asset.id,
      });
    }

    await client.query("COMMIT");

    return asset;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};
