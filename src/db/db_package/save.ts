import type { Package } from "../../domain/package.js";
import { client } from "../client.js";

export const save_db_package = async (pack: Package): Promise<Package> => {
  await client.query("BEGIN");

  try {
    await client.query(
      `
        INSERT INTO packages (
          id,
          name,
          linked_asset_id
        )
        VALUES ($1, $2, $3)
      `,
      [
        pack.id,
        pack.name,
        pack.linkedAsset ?? null,
      ],
    );

    for (const condition of pack.conditions ?? []) {
      await client.query(
        `
          INSERT INTO package_conditions (
            package_id,
            definition_id,
            operator,
            value
          )
          VALUES ($1, $2, $3, $4)
        `,
        [
          pack.id,
          condition.definition,
          condition.operator,
          JSON.stringify(condition.value),
        ],
      );
    }

    await client.query("COMMIT");

    return pack;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};