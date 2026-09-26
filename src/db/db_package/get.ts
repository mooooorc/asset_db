import type { Package, PackageId } from "../../domain/package.js";
import { client } from "../client.js";

export const get_db_package = async (
  id: PackageId,
): Promise<Package | null> => {
  const result = await client.query(
    `
          SELECT id, name, condition_definition, condition_value
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
    ...(row.condition_definition
      ? {
          condition: {
            definition: row.condition_definition,
            value: row.condition_value,
          },
        }
      : {}),
  };
};
