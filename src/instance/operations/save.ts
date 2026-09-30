import { AssetService } from "../../asset/asset.service.js";
import { client } from "../../db/client.js";

import { randomUUID } from "node:crypto";
import type { Instance, InstanceId } from "../instance.domain.js";
import type { Asset, AssetId } from "../../asset/asset.domain.js";

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

const update_instance_counter = async (asset_id: AssetId) => {
  const result = await client.query(
    `
      UPDATE instance_counters
      SET next_index = next_index + 1
      WHERE asset_id = $1
      RETURNING next_index - 1 AS index
    `,
    [asset_id],
  );

  if (result.rows.length === 0) {
    throw new Error(`Instance counter not found: ${asset_id}`);
  }

  return result.rows[0].index;
};

export const save_instance = async (
  instance: new_instance,
  assetService: AssetService
): Promise<Instance> => {
  const asset = await assetService.get(instance.type);

  if (!asset) {
    throw new Error(`Asset not found: ${instance.type}`);
  }

  check_required(asset, instance);
  await check_identifiable(asset, instance);

  const index = await update_instance_counter(instance.type);

  const newInstance = {
    ...instance,
    asset_db_id: randomUUID() as InstanceId,
    index,
  };

  const properties = Object.keys(newInstance.properties);

  const columns = ["asset_db_ID", "index", ...properties]
    .map((column) => `"${column}"`)
    .join(", ");

  const values = properties
    .map((_, index) => `$${index + 3}`)
    .join(", ");

  const query = `
    INSERT INTO "${newInstance.type}" (${columns})
    VALUES ($1, $2, ${values})
  `;

  await client.query(query, [
    newInstance.asset_db_id,
    newInstance.index,
    ...properties.map(
      (property) => newInstance.properties[property],
    ),
  ]);

  return newInstance;
};