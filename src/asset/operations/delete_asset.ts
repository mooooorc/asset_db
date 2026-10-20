import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { AssetId } from "../asset.domain.js";


export const delete_asset = {
  self: async (id: AssetId): Promise<void> => {
    await client.query("BEGIN");

    try {
      await client.query(`DROP TABLE "${id}"`);

      await client.query(
        `
          DELETE FROM asset_definitions
          WHERE asset_id = $1
        `,
        [id],
      );

      await client.query(
        `
          DELETE FROM instance_counters
          WHERE asset_id = $1
        `,
        [id],
      );

      await client.query(
        `
          DELETE FROM assets
          WHERE id = $1
        `,
        [id],
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  },

  column: async (
    id: AssetId,
    def_id: DefinitionId,
  ): Promise<void> => {
    await client.query(
      `
        ALTER TABLE "${id}"
        DROP COLUMN "${def_id}"
      `,
    );
  },
};
