import { client } from "../../db/client.js";
import type { PackageId } from "../../package/package.domain.js";
import type { ConsumerId } from "../consumer.domain.js";

export const unlink_package_from_consumer = async (
  consumerId: ConsumerId,
  packageId: PackageId,
): Promise<void> => {
  await client.query(
    `
      DELETE FROM consumer_packages
      WHERE consumer_id = $1
        AND package_id = $2
    `,
    [consumerId, packageId],
  );
};