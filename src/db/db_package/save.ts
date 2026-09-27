import type { Package } from "../../domain/package.js";
import { client } from "../client.js";
import { save_db_package_conditions } from "./save_conditions.js";


export const insert_db_package = async (
  pack: Package,
): Promise<void> => {
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

  await save_db_package_conditions(
    pack.id,
    pack.conditions ?? [],
  );
};

export const save_db_package = async (
  pack: Package,
): Promise<Package> => {
  await client.query("BEGIN");

  try {
    await insert_db_package(pack);

    await client.query("COMMIT");

    return pack;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};