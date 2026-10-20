import { client } from "../../db/client.js";
import type { Asset } from "../asset.domain.js";



export const insert_asset = {
  definitions: async (asset: Asset) => {
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
          definition.id,
          definition.required ?? false,
          definition.identifiable ?? false,
        ],
      );
    }
  },
  self: async (asset: Asset) => {
    await client.query(
      ` 
      INSERT INTO assets (id, tag, name, expose_as_package)
      VALUES ($1, $2, $3, $4)
    `,
      [asset.id, asset.tag, asset.name, asset.exposeAsPackage ?? false],
    );
  },
  instance_counters: async (asset: Asset) => {
    await client.query(
      `
    INSERT INTO instance_counters (asset_id)
    VALUES ($1)
    `,
      [asset.id],
    );
  },
};


