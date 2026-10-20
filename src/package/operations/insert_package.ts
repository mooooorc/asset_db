import { client } from "../../db/client.js";
import type { Package, PackageId } from "../package.domain.js";
import { save_package } from "./save_package.js";


export const insert_package = {

  self: async (pack: Package): Promise<void> => {
    await client.query(
      `
      INSERT INTO packages (
        id,
        tag,
        name,
        linked_asset_id
      )
      VALUES ($1, $2, $3, $4)
    `,
      [pack.id, pack.tag, pack.name, pack.linkedAsset ?? null],
    );

    await save_package.conditions(pack.id, pack.conditions ?? []);
  },

  discussion_counter: async (id: PackageId): Promise<void> => {
    await client.query(
      `
      INSERT INTO discussion_counters (package_id)
      VALUES ($1)
    `,
      [id],
    );
  },
};

