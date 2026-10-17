import { client } from "../../../db/client.js";
import type { InstanceId } from "../../instance.domain.js";

export const delete_issues = async (instance_id: InstanceId) => {
  await client.query(
    `DELETE FROM healthy_issues
     WHERE instance_id = $1`,
    [instance_id],
  );
};