import { AssetService } from "../../../asset/asset.service.js";
import { client } from "../../../db/client.js";

import { randomUUID } from "node:crypto";
import type {
  Instance,
  InstanceId,
  new_instance,
} from "../../instance.domain.js";
import type { Asset, AssetId } from "../../../asset/asset.domain.js";
import type { DefinitionId } from "../../../definition/definition.domain.js";
import type { InstanceService } from "../../instance.service.js";
import { parse_instance_reference } from "../parse_reference.js";
import { insert_instance_relation } from "./create_relation.js";
import { check_required_issues } from "../check/check_required.js";
import { check_identifiable_issues } from "../check/check_identifiable.js";

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

const split_properties = async (
  properties: Record<string, unknown>,
  assetService: AssetService,
) => {
  const normal: Record<string, unknown> = {};
  const relations: Record<string, unknown> = {};

  for (const [definitionId, value] of Object.entries(properties)) {
    const definition = await assetService.getDefinition(
      definitionId as DefinitionId,
    );

    if (definition && "type" in definition && definition.type === "relation") {
      relations[definitionId] = value;
    } else {
      normal[definitionId] = value;
    }
  }

  return { normal, relations };
};

export const save_instance = async (
  instance: new_instance,
  assetService: AssetService,
  instanceService: InstanceService,
): Promise<Instance> => {
  const asset = await assetService.get(instance.type);

  if (!asset) {
    throw new Error(`Asset not found: ${instance.type}`);
  }

  const { normal, relations } = await split_properties(
    instance.properties,
    assetService,
  );

  const index = await update_instance_counter(instance.type);

  const newInstance = {
    ...instance,
    asset_db_id: randomUUID() as InstanceId,
    index,
  };

  const properties = Object.keys(normal);

  const columns = ["asset_db_ID", "index", ...properties]
    .map((column) => `"${column}"`)
    .join(", ");

  const values = properties.map((_, index) => `$${index + 3}`).join(", ");

  const query = `
    INSERT INTO "${newInstance.type}" (${columns})
    VALUES ($1, $2, ${values})
  `;

  await client.query(query, [
    newInstance.asset_db_id,
    newInstance.index,
    ...properties.map((property) => normal[property]),
  ]);

  await check_required_issues(asset, newInstance);
  await check_identifiable_issues(asset, newInstance);

  for (const [definitionId, value] of Object.entries(relations)) {
    if (!Array.isArray(value)) {
      throw new Error("Relation value must be an array");
    }

    for (const reference of value) {
      const target = parse_instance_reference(reference as string);

      const targetInstance = await instanceService.getByIndex(
        target.assetId,
        target.index,
      );

      if (!targetInstance) {
        throw new Error(
          `Instance not found: ${target.assetId}#${target.index}`,
        );
      }

      await insert_instance_relation(
        newInstance,
        targetInstance,
        definitionId as DefinitionId,
      );
    }
  }

  return newInstance;
};
