import type { Asset } from "../../../asset/asset.domain.js"
import { client } from "../../../db/client.js"
import type { Instance, new_instance } from "../../instance.domain.js"
import { add_instance_issue } from "../write/add_issue.js";



export const check_required_issues = async (
  asset: Asset,
  instance: Instance,
) => {
  const required_defs = asset.definitions.filter((def) => def.required);

  for (const def of required_defs) {
    const value = instance.properties[def.definition];

    if (value === undefined || value === null) {
      await add_instance_issue(instance.asset_db_id, 1, def.definition);
    }
  }
};
