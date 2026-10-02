import { client } from "../../db/client.js";
import type { Definition } from "../../definition/definition.domain.js";

import { DefinitionService } from "../../definition/definition.service.js";

import {
  insert_discussion_counter,
  insert_package,
} from "../../package/operations/save.js";
import type { PackageId } from "../../package/package.domain.js";
import type { Asset } from "../asset.domain.js";
import { create_asset_table } from "./create_table.js";
import { get_columns } from "./get_columns.js";

export const insert_asset_definitions = async (asset: Asset) => {
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

export const insert_instance_counters = async (asset: Asset) => {
  await client.query(
    `
    INSERT INTO instance_counters (asset_id)
    VALUES ($1)
    `,
    [asset.id],
  );
};

export const insert_asset = async (asset: Asset) => {
  await client.query(
    ` 
      INSERT INTO assets (id, name, expose_as_package)
      VALUES ($1, $2, $3)
    `,
    [asset.id, asset.name, asset.exposeAsPackage ?? false],
  );
};

export const save_asset = async (
  asset: Asset,
  definitionService: DefinitionService,
): Promise<Asset> => {
  await client.query("BEGIN");

  try {
    await insert_asset(asset);
    await insert_instance_counters(asset);
    await insert_asset_definitions(asset);

    const definitions = await Promise.all(
      asset.definitions.map((asset_def) =>
        definitionService.get(asset_def.definition),
      ),
    );

    const columns = (
      await Promise.all(
        definitions
          .filter((definition): definition is Definition => definition !== null)
          .map((definition) => get_columns(definition, definitionService)),
      )
    ).flat();

    await create_asset_table(asset, columns);

    if (asset.exposeAsPackage) {
      const pack = {
        id: asset.id as unknown as PackageId,
        name: asset.name,
        linkedAsset: asset.id,
      };

      await insert_package(pack);
      await insert_discussion_counter(pack.id);
    }

    await client.query("COMMIT");

    return asset;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};
