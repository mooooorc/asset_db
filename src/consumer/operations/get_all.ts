import { client } from "../../db/client.js";
import type { PackageId } from "../../package/package.domain.js";
import type { Consumer } from "../consumer.domain.js";


export const get_all_consumers = async (): Promise<Consumer[]> => {
  const result = await client.query(
    `
      SELECT
        c.id,
        c.name,
        cp.package_id
      FROM consumers c
      LEFT JOIN consumer_packages cp
        ON cp.consumer_id = c.id
      ORDER BY c.id
    `,
  );

  const consumers = new Map<string, Consumer>();

  for (const row of result.rows) {
    const consumer = consumers.get(row.id);

    if (consumer) {
      if (row.package_id) {
        consumer.packages.push(row.package_id as PackageId);
      }

      continue;
    }

    consumers.set(row.id, {
      id: row.id,
      name: row.name,
      packages: row.package_id
        ? [row.package_id as PackageId]
        : [],
    });
  }

  return Array.from(consumers.values());
};