import { client } from "../../db/client.js";
import type { PackageId } from "../../package/package.domain.js";
import type { ConsumerId } from "../consumer.domain.js";

export const get_consumer_linked_packages = async (
  consumerId: ConsumerId,
): Promise<PackageId[]> => {
  const result = await client.query(
    `
      SELECT package_id
      FROM consumer_packages
      WHERE consumer_id = $1
    `,
    [consumerId],
  );

  return result.rows.map(
    (row) => row.package_id as PackageId,
  );
};