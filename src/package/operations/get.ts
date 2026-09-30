import type { AssetService } from "../../asset/asset.service.js";
import { client } from "../../db/client.js";

import type { Package, PackageId } from "../package.domain.js";



export const get_package = async (
  id: PackageId,
): Promise<Package | null> => {
  const result = await client.query(
    `
      SELECT
        id,
        name,
        linked_asset_id
      FROM packages
      WHERE id = $1
    `,
    [id],
  );

  const row = result.rows[0];

  if (!row) return null;

  const conditions = await client.query(
    `
      SELECT
        definition_id,
        operator,
        value
      FROM package_conditions
      WHERE package_id = $1
    `,
    [id],
  );

  return {
    id: row.id,
    name: row.name,
    ...(row.linked_asset_id
      ? {
          linkedAsset: row.linked_asset_id,
        }
      : {}),
    ...(conditions.rows.length > 0
      ? {
          conditions: conditions.rows.map((condition) => ({
            definition: condition.definition_id,
            operator: condition.operator,
            value: condition.value,
          })),
        }
      : {}),
  };
};