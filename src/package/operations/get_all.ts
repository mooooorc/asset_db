import { client } from "../../db/client.js";
import type { Package } from "../package.domain.js";


export const get_all_packages = async (): Promise<Package[]> => {
  const result = await client.query(
    `
      SELECT
        id,
        name,
        linked_asset_id
      FROM packages
    `,
  );

  return Promise.all(
    result.rows.map(async (row) => {
      const conditions = await client.query(
        `
          SELECT
            definition_id,
            operator,
            value
          FROM package_conditions
          WHERE package_id = $1
        `,
        [row.id],
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
    }),
  );
};