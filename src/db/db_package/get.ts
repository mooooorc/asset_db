import type { Package, PackageId } from "../../domain/package.js";
import { client } from "../client.js";

export const get_db_package = async (
  id: PackageId,
): Promise<Package | null> => {
  const result = await client.query(
    `
      SELECT
        id,
        name,
        linked_asset_id,
        condition_definition,
        condition_operator,
        condition_value
      FROM packages
      WHERE id = $1
    `,
    [id],
  );

  const row = result.rows[0];

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    ...(row.linked_asset_id
      ? {
          linkedAsset: row.linked_asset_id,
        }
      : {}),
    ...(row.condition_definition
      ? {
          condition: {
            definition: row.condition_definition,
            operator: row.condition_operator,
            value: row.condition_value,
          },
        }
      : {}),
  };
};
