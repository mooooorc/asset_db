import { client } from "../../../db/client.js";
import type { InstanceId } from "../../instance.domain.js";

export const get_instance_issues = async (instance_id: InstanceId) => {
    const result = await client.query(
        `
        SELECT issue_code, field
        FROM healthy_issues
        WHERE instance_id = $1
        `, [instance_id]
    )

    return result.rows;
}