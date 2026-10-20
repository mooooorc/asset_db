import type { Asset } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";

import type { InstanceId, InstanceToCheck } from "../instance.domain.js";
import { create_instance } from "./create_instance.js";


export const check_instance = {
  identifiable: async (asset: Asset, instance: InstanceToCheck) => {
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
        await create_instance.issue(instance.id, 2, def.id);
        await create_instance.issue(row.id as InstanceId, 2, def.id);
      }
    }
  },

  required: async (asset: Asset, instance: InstanceToCheck) => {
    const required_defs = asset.definitions.filter((def) => def.required);

    for (const def of required_defs) {
      const value = instance.properties[def.id];

      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        await create_instance.issue(instance.id, 1, def.id);
      }
    }
  },
};
