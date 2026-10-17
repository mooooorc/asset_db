import { client } from "../../../db/client.js";
import type { InstanceId } from "../../instance.domain.js";

export const add_instance_issue = async (
  instance_id: InstanceId,
  issue_code: number,
  field: string,
) => {
  await client.query(
    `INSERT INTO healthy_issues (instance_id, issue_code, field)
     VALUES ($1, $2, $3)
     ON CONFLICT (instance_id, issue_code, field) DO NOTHING`,
    [instance_id, issue_code, field],
  );
};
