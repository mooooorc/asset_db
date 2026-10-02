import { client } from "../../db/client.js";
import type { PackageId } from "../../package/package.domain.js";
import type { ConsumerId } from "../consumer.domain.js";

export const link_package_to_consumer = async (
  consumerId: ConsumerId,
  packageId: PackageId,
): Promise<void> => {
  await client.query(
    `
      INSERT INTO consumer_packages (
        consumer_id,
        package_id
      )
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `,
    [consumerId, packageId],
  );
};