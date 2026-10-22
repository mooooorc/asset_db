import type { Asset, AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { PersistenceService } from "../../persistence/persistence.service.js";
import type { InstanceId, InstanceToCheck } from "../instance.domain.js";


export const check_instance = {
  identifiable: async (
    asset: Asset,
    instance: InstanceToCheck,
    p_service: PersistenceService,
  ) => {
    const identifiable_defs = asset.definitions.filter(
      (def) => def.identifiable,
    );

    for (const def of identifiable_defs) {
      const value = instance.properties[def.id];

      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        continue;
      }

      const result = await client.query(
        `SELECT "id"
       FROM "${asset.id}"
       WHERE "${def.id}" = $1
         AND "id" <> $2`,
        [value, instance.id],
      );

      for (const row of result.rows) {
        await p_service.persist_instance_issue(instance.id, 2, def.id);
        await p_service.persist_instance_issue(row.id as InstanceId, 2, def.id);
      }
    }
  },

  required: async (
    asset: Asset,
    instance: InstanceToCheck,
    p_service: PersistenceService,
  ) => {
    const required_defs = asset.definitions.filter((def) => def.required);

    for (const def of required_defs) {
      const value = instance.properties[def.id];

      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        await p_service.persist_instance_issue(instance.id, 1, def.id)
      }
    }
  },

  existence: async (
    instance_id: InstanceId,
    asset_id: AssetId,
  ): Promise<boolean> => {
    const result = await client.query(
      `SELECT 1 FROM "${asset_id}" WHERE id = $1 LIMIT 1`,
      [instance_id],
    );

    return result.rows.length > 0;
  },
};
