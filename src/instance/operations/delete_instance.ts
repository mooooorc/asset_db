
import { client } from "../../db/client.js";

import type { InstanceId } from "../instance.domain.js";
import { find_instance } from "./find_instance.js";

export const delete_instance = {
  self: async (id: InstanceId): Promise<void> => {
    

    const asset_id = find_instance.asset_id(id);

  

    await client.query(
      `
      DELETE FROM "${asset_id}"
      WHERE "id" = $1
    `,
      [id],
    );
  },

  issues: async (id: InstanceId) => {
    await client.query(
      `DELETE FROM healthy_issues
     WHERE instance_id = $1`,
      [id],
    );
  },
};
