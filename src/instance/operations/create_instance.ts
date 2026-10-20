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

import { find_asset } from "../../asset/operations/find_asset.js";
import { check_instance } from "./check_instance.js";
import { find_instance } from "./find_instance.js";
import { get_instance } from "./get_instance.js";
import { find_definition } from "../../definition/operations/find_definition.js";
import type { AssetId } from "../../asset/asset.domain.js";
import { insert_instance } from "./insert_instance.js";
import { map_property_tags } from "./utils/map_property_tags.js";
import { get_asset } from "../../asset/operations/get_asset.js";

export const create_instance = (() => {
  const split_properties = async (
    properties: Record<string, unknown>,
    assetService: AssetService,
  ) => {
    const normal: Record<string, unknown> = {};
    const relations: Record<string, unknown> = {};

    for (const [tag, value] of Object.entries(properties)) {
      const definitionId = await find_definition.id_by_tag(
        tag as DefinitionTag,
      );

      if (!definitionId) {
        throw new Error(`Definition not found: ${tag}`);
      }

      const definition = await assetService.getDefinition(tag as DefinitionTag);

      if (
        definition &&
        "type" in definition &&
        definition.type === "relation"
      ) {
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
      assetService: AssetService,
    ): Promise<Instance> => {
      const asset_id = await find_asset.id_by_tag(data.type);

      if (!asset_id) {
        throw new Error(`Asset not found: ${data.type}`);
      }

      const asset = await get_asset.self(asset_id);

      if (!asset) {
        throw new Error(`Asset not found: ${data.type}`);
      }

      const { normal, relations } = await split_properties(
        data.properties,
        assetService,
      );

      const index = await update_instance_counter(asset.id);

      const instanceToCheck: InstanceToCheck = {
        id: randomUUID() as InstanceId,
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
    INSERT INTO "${asset.id}" (${columns})
    VALUES ($1, $2${values ? `, ${values}` : ""})
  `;

      await client.query(query, [
        instanceToCheck.id,
        instanceToCheck.tag.index,
        ...properties.map((property) => normal[property]),
      ]);

      await check_instance.required(asset, instanceToCheck);
      await check_instance.identifiable(asset, instanceToCheck);

      const issues = await get_instance.issues(instanceToCheck.id);

      const savedInstance: Instance = {
        ...instanceToCheck,
        asset: asset.id,
        status: issues.length > 0 ? "unhealthy" : "healthy",
      };

      for (const [definitionId, value] of Object.entries(relations)) {
        if (!Array.isArray(value)) {
          throw new Error("Relation value must be an array");
        }

        for (const reference of value) {
          const tag = reference as InstanceTag;
          const targetInstanceId = await find_instance.id_by_tag(tag);

          if (!targetInstanceId) {
            throw new Error(`Instance not found: ${tag.assetTag}:${tag.index}`);
          }

          const targetAssetId = await find_asset.id_by_tag(tag.assetTag);

          if (!targetAssetId) {
            throw new Error(`Asset not found: ${tag.assetTag}`);
          }

          await insert_instance.relation(
            savedInstance.id,
            targetInstanceId,
            savedInstance.asset,
            targetAssetId,
            definitionId as DefinitionId,
          );
        }
      }

      const relationsOutput = await get_instance.relations(
        asset.id,
        savedInstance.id,
      );

      return {
        ...savedInstance,
        properties: await map_property_tags({
          ...savedInstance.properties,
          ...relationsOutput,
        }),
      };
    },

    relation: async (
      a: InstanceTag,
      b: InstanceTag,
      def_id: DefinitionId,
    ): Promise<void> => {
      const [instanceA, instanceB, assetA, assetB] = await Promise.all([
        find_instance.id_by_tag(a),
        find_instance.id_by_tag(b),
        find_asset.id_by_tag(a.assetTag),
        find_asset.id_by_tag(b.assetTag),
      ]);

      if (!assetA || !assetB) {
        throw new Error("Asset not found");
      }

      if (!instanceA || !instanceB) {
        throw new Error("Instance not found");
      }

      await insert_instance.relation(
        instanceA,
        instanceB,
        assetA,
        assetB,
        def_id,
      );
    },

    issue: async (id: InstanceId, code: number, field: string) => {
      await client.query(
        `INSERT INTO healthy_issues (instance_id, issue_code, field)
     VALUES ($1, $2, $3)
     ON CONFLICT (instance_id, issue_code, field) DO NOTHING`,
        [id, code, field],
      );
    },
  };
})();
