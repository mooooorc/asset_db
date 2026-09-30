import { client } from "../../db/client.js";
import type { Package } from "../package.domain.js";

import { save_package_conditions } from "./save_condition.js";

export const insert_package = async (
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

  await save_package_conditions(
    pack.id,
    pack.conditions ?? [],
  );
};

export const save_package = async (
  pack: Package,
): Promise<Package> => {
  await client.query("BEGIN");

  try {
    await insert_package(pack);

    await client.query("COMMIT");

    return pack;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};