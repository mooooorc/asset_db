import type { Asset } from "../../domain/asset.js";
import { client } from "../client.js";

export const get_all_db_assets = async (): Promise<Asset[]> => {
  const result = await client.query(
    `
      SELECT id, name, expose_as_package
      FROM assets
    `,
  );

  const assets = await Promise.all(
    result.rows.map(async (asset) => {
      const definitions = await client.query(
        `
          SELECT definition_id, required
          FROM asset_definitions
          WHERE asset_id = $1
        `,
        [asset.id],
      );

      return {
        id: asset.id,
        name: asset.name,
        definitions: definitions.rows.map((row) => ({
          definition: row.definition_id,
          ...(row.required ? { required: true as const } : {}),
        })),
        ...(asset.expose_as_package
          ? { exposeAsPackage: true as const }
          : {}),
      };
    }),
  );

  return assets;
};