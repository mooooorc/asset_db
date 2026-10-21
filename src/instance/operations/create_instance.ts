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
import { insert_instance } from "./insert_instance.js";
import type { DefinitionService } from "../../definition/definition.service.js";
import type { InstanceService } from "../instance.service.js";
import { build_instance } from "./build_instance.js";

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
      assetService: AssetService,
      definitionService: DefinitionService,
      instanceService: InstanceService,
    ): Promise<Instance> => {

      
      const asset_id = await assetService.find_id_by_tag(data.type);

      if (!asset_id) {
        throw new Error(`Asset not found: ${data.type}`);
      }

      const asset = await assetService.get_by_id(asset_id);

      if (!asset) {
        throw new Error(`Asset not found: ${data.type}`);
      }

      const id = `${asset_id}/${randomUUID()}` as InstanceId;

      const { normal, relations } = await split_properties(
        data.properties,
        definitionService,
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

      await check_instance.required(asset, instanceToCheck);
      await check_instance.identifiable(asset, instanceToCheck);

      for (const [definitionId, value] of Object.entries(relations)) {
        if (!Array.isArray(value)) {
          throw new Error("Relation value must be an array");
        }

        for (const reference of value) {
          const tag = reference as InstanceTag;

          const targetInstanceId = await find_instance.id_by_tag(
            tag,
            assetService,
          );

          if (!targetInstanceId) {
            throw new Error(`Instance not found: ${tag.assetTag}:${tag.index}`);
          }

          const targetAssetId = instanceService.find_asset_id(targetInstanceId);

          await insert_instance.relation(
            id,
            targetInstanceId,
            asset_id,
            targetAssetId,
            definitionId as DefinitionId,
            instanceService,
          );
        }
      }

      return build_instance.self(
        id,
        asset_id,
        data.type,
        index,
        normal,
        definitionService,
      );
    },

    relation: async (
      a: InstanceTag,
      b: InstanceTag,
      def_id: DefinitionId,
      assetService: AssetService,
      instanceService: InstanceService,
    ): Promise<void> => {
      const [instanceA, instanceB, assetA, assetB] = await Promise.all([
        find_instance.id_by_tag(a, assetService),
        find_instance.id_by_tag(b, assetService),
        await assetService.find_id_by_tag(a.assetTag),
        await assetService.find_id_by_tag(b.assetTag),
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
        instanceService,
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
