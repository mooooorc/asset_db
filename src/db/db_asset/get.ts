import type { AssetId } from "../../domain/asset.js";
import { client } from "../client.js";

export const get_db_asset = async (id: AssetId) => {
  const result = await client.query(
    `
      SELECT id, name, expose_as_package
      FROM assets
      WHERE id = $1
    `,
    [id],
  );

  const asset = result.rows[0];

  if (!asset) return null;

  const definitions = await client.query(
    `
      SELECT definition_id, required
      FROM asset_definitions
      WHERE asset_id = $1
    `,
    [id],
  );

  return {
    id: asset.id,
    name: asset.name,
    definitions: definitions.rows.map((row) => ({
      definition: row.definition_id,
      ...(row.required ? { required: true as const } : {}),
    })),
    ...(asset.expose_as_package ? { exposeAsPackage: true as const } : {}),
  };
};
