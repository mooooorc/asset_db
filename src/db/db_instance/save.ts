import type { Instance, InstanceId } from "../../domain/instance.js";
import { randomUUID } from "node:crypto";
import { client } from "../client.js";
import { db_asset } from "../db_asset/main.js";

export const save_db_instance = async (
  instance: Omit<Instance, "asset_db_id">
): Promise<Instance> => {
  const asset = await db_asset.get(instance.type);

  if (!asset) {
    throw new Error(`Asset not found: ${instance.type}`);
  }

  const requiredDefinitions = asset.definitions.filter(
    (definition) => definition.required,
  );

  for (const definition of requiredDefinitions) {
    if (!(definition.definition in instance.properties)) {
      throw new Error(
        `Missing required definition: ${definition.definition}`,
      );
    }
  }

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