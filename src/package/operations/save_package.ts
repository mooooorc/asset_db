import { client } from "../../db/client.js";
import type { Package, PackageData, PackageId } from "../package.domain.js";
import { insert_package } from "./insert_package.js";
import { build_package } from "./build_package.js";


export const save_package = {

  self: async (data: PackageData): Promise<Package> => {
    const pack = await build_package.self(data);

    await client.query("BEGIN");

    try{
      await insert_package.self(pack);
      await insert_package.discussion_counter(pack.id);
      await client.query("COMMIT");

      return pack;
    } catch(error) {
      await client.query("ROLLBACK");
      throw error;
    }
  },

  conditions: async (id: PackageId, conditions: Package["conditions"]):Promise<void> => {
    for (const condition of conditions ?? []) {
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
        id,
        condition.definition,
        condition.operator,
        JSON.stringify(condition.value),
      ],
    );
    }
  }
}

