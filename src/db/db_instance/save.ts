import type { Instance, InstanceId } from "../../domain/instance.js";
import { randomUUID } from "node:crypto";

import { client } from "../client.js";

export const save_db_instance = async (
  instance: Omit<Instance, "asset_db_id">
): Promise<Instance> => {
  const newInstance = {
    ...instance,
    asset_db_id: randomUUID() as InstanceId,
  };

  const properties = Object.keys(newInstance.properties);

  const columns = ["asset_db_ID", ...properties]
    .map((column) => `"${column}"`)
    .join(", ");

  const values = properties
    .map((_, index) => `$${index + 2}`)
    .join(", ");

  const query = `
    INSERT INTO "${newInstance.type}" (${columns})
    VALUES ($1, ${values})
  `;

  await client.query(query, [
    newInstance.asset_db_id,
    ...properties.map(
      (property) => newInstance.properties[property],
    ),
  ]);

  return newInstance;
};