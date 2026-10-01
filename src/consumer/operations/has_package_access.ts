import { client } from "../../db/client.js";
import type { ConsumerId } from "../consumer.domain.js";
import type { PackageId } from "../../package/package.domain.js";

export const has_package_access = async (
  consumerIds: ConsumerId[],
  packageId: PackageId,
): Promise<boolean> => {
  const result = await client.query(
    `
      SELECT 1
      FROM consumer_packages
      WHERE consumer_id = ANY($1)
        AND package_id = $2
      LIMIT 1
    `,
    [consumerIds, packageId],
  );

  return result.rows.length > 0;
};