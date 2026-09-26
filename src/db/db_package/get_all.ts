import type { Package } from "../../domain/package.js";
import { client } from "../client.js";

export const get_all_db_packages = async (): Promise<Package[]> => {
    const result = await client.query(
      `
      SELECT id, name, condition_definition, condition_value
      FROM packages
    `,
    );

    return result.rows.map((row) => ({
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
    }));
  }