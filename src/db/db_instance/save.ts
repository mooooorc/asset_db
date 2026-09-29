import type { Instance, InstanceId } from "../../domain/instance.js";
import { randomUUID } from "node:crypto";
import { client } from "../client.js";
import { db_asset } from "../db_asset/main.js";
import type { Asset } from "../../domain/asset.js";

type new_instance = Omit<Instance, "asset_db_id">

const check_required = (asset: Asset, instance: new_instance ) => {

  const required_defs = asset.definitions.filter((def) => def.required)

  for (const def of required_defs) {
    if(!(def.definition in instance.properties)) {
      throw new Error (`Missing required definition: ${def.definition}`)
    }
  }
}

const check_identifiable = async (
  asset: Asset,
  instance: new_instance,
) => {
  const identifiable_defs = asset.definitions.filter(
    (def) => def.identifiable,
  );

  for (const def of identifiable_defs) {
    const value = instance.properties[def.definition];

    if (value === undefined) {
      continue;
    }

    const result = await client.query(
      `
        SELECT 1
        FROM "${asset.id}"
        WHERE "${def.definition}" = $1
        LIMIT 1
      `,
      [value],
    );

    if (result.rows.length > 0) {
      throw new Error(
        `Duplicate identifiable definition: ${def.definition}`,
      );
    }
  }
};

export const save_db_instance = async (
  instance: new_instance 
): Promise<Instance> => {
  const asset = await db_asset.get(instance.type);

  if (!asset) {
    throw new Error(`Asset not found: ${instance.type}`);
  }

  check_required(asset, instance)
  await check_identifiable(asset, instance);

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