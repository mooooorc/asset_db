import { AssetService } from "../../asset/asset.service.js";
import { client } from "../../db/client.js";

import { randomUUID } from "node:crypto";
import type {
  Instance,
  InstanceId,
  InstanceTag,
  InstanceData,
  InstanceToCheck,
} from "../instance.domain.js";

import type {
  DefinitionId,
  DefinitionTag,
} from "../../definition/definition.domain.js";

import { check_instance } from "./check_instance.js";
import { find_instance } from "./find_instance.js";
import type { AssetId } from "../../asset/asset.domain.js";
import type { DefinitionService } from "../../definition/definition.service.js";

import { build_instance } from "./build_instance.js";
import type { PersistenceService } from "../../persistence/persistence.service.js";

export const create_instance = (() => {
  const split_properties = async (
    properties: Record<string, unknown>,
    definitionService: DefinitionService,
  ) => {
    const normal: Record<string, unknown> = {};
    const relations: Record<string, unknown> = {};

    for (const [tag, value] of Object.entries(properties)) {
      const definitionId = await definitionService.find_id_by_tag(
        tag as DefinitionTag,
      );

      if (!definitionId) {
        throw new Error(`Definition not found: ${tag}`);
      }

      const definition = await definitionService.get(tag as DefinitionTag);

      if (definition && definition.type === "relation") {
        relations[definitionId] = value;
      } else {
        normal[definitionId] = value;
      }
    }

    return { normal, relations };
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

  return {
    self: async (
      data: InstanceData,
      a_service: AssetService,
      d_service: DefinitionService,
      p_service: PersistenceService,
    ): Promise<Instance> => {
      const asset_id = await a_service.find_id_by_tag(data.type);

      if (!asset_id) {
        throw new Error(`Asset not found: ${data.type}`);
      }

      const asset = await a_service.get_by_id(asset_id);

      if (!asset) {
        throw new Error(`Asset not found: ${data.type}`);
      }

      const id = `${asset_id}/${randomUUID()}` as InstanceId;

      const { normal, relations } = await split_properties(
        data.properties,
        d_service,
      );

      const index = await update_instance_counter(asset.id);

      const instanceToCheck: InstanceToCheck = {
        id,
        tag: {
          assetTag: data.type,
          index,
        },
        properties: normal,
      };

      const properties = Object.keys(normal);

      const columns = ["id", "index", ...properties]
        .map((column) => `"${column}"`)
        .join(", ");

      const values = properties.map((_, index) => `$${index + 3}`).join(", ");

      const query = `
        INSERT INTO "${asset_id}" (${columns})
        VALUES ($1, $2${values ? `, ${values}` : ""})
      `;

      await client.query(query, [
        instanceToCheck.id,
        instanceToCheck.tag.index,
        ...properties.map((property) => normal[property]),
      ]);

      await check_instance.required(asset, instanceToCheck, p_service);
      await check_instance.identifiable(asset, instanceToCheck, p_service);

      for (const [definitionId, value] of Object.entries(relations)) {
        if (!Array.isArray(value)) {
          throw new Error("Relation value must be an array");
        }

        for (const reference of value) {
          const tag = reference as InstanceTag;

          const instance_b_id = await find_instance.id_by_tag(
            tag,
            a_service,
          );

          if (!instance_b_id) {
            throw new Error(`Instance not found: ${tag.assetTag}:${tag.index}`);
          }

          const asset_b_id = find_instance.asset_id(instance_b_id);

          const [
            first_instance_id,
            second_instance_id,
            first_asset_id,
            second_asset_id,
          ] =
            id < instance_b_id
              ? [id, instance_b_id, asset_id, asset_b_id]
              : [instance_b_id, id, asset_b_id, asset_id];

          const [a_exists, b_exists] = await Promise.all([
            check_instance.existence(first_instance_id, first_asset_id),
            check_instance.existence(second_instance_id, second_asset_id),
          ]);

          if (!a_exists || !b_exists) {
            throw new Error("Instance not found");
          }

          await p_service.persist_instance_relations(
            definitionId as DefinitionId,
            first_asset_id,
            second_asset_id,
            first_instance_id,
            second_instance_id,
          );
        }
      }

      return build_instance.self(
        id,
        asset_id,
        data.type,
        index,
        normal,
        d_service,
      );
    },
  };
})();
