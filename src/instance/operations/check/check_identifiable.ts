import type { Asset } from "../../../asset/asset.domain.js";
import { client } from "../../../db/client.js";
import type { Instance } from "../../instance.domain.js";
import { add_instance_issue } from "../write/add_issue.js";

export const check_identifiable_issues = async (
  asset: Asset,
  instance: Instance,
) => {
  const identifiable_defs = asset.definitions.filter(
    (def) => def.identifiable,
  );

  for (const def of identifiable_defs) {
    const value = instance.properties[def.definition];

    if (value === undefined || value === null) {
      continue;
    }

    const result = await client.query(
      `SELECT "asset_db_ID"
       FROM "${asset.id}"
       WHERE "${def.definition}" = $1
         AND "asset_db_ID" <> $2`,
      [value, instance.asset_db_id],
    );

    for (const row of result.rows) {
      await add_instance_issue(instance.asset_db_id, 2, def.definition);
      await add_instance_issue(row.asset_db_ID, 2, def.definition);
    }
  }
};