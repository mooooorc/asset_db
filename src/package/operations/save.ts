import { client } from "../../db/client.js";
import type { Package, PackageId } from "../package.domain.js";

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

export const insert_discussion_counter = async (
  packageId: PackageId,
): Promise<void> => {
  await client.query(
    `
      INSERT INTO discussion_counters (package_id)
      VALUES ($1)
    `,
    [packageId],
  );
};

export const save_package = async (
  pack: Package,
): Promise<Package> => {
  await client.query("BEGIN");

  try {
    await insert_package(pack);
    await(insert_discussion_counter(pack.id))

    await client.query("COMMIT");

    return pack;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};