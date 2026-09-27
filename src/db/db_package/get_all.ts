import type { Package } from "../../domain/package.js";
import { client } from "../client.js";

export const get_all_db_packages = async (): Promise<Package[]> => {
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
    `,
  );

  return result.rows.map((row) => ({
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
  }));
};