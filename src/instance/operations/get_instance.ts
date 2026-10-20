import type { AssetId, AssetTag } from "../../asset/asset.domain.js";
import { find_asset } from "../../asset/operations/find_asset.js";
import { client } from "../../db/client.js";
import type { Instance, InstanceId } from "../instance.domain.js";
import { find_instance } from "./find_instance.js";
import { map_property_tags } from "./utils/map_property_tags.js";

export const get_instance = {
  self: async (assetId: AssetId, id: InstanceId): Promise<Instance | null> => {
    const instance = await find_instance.by_id(id, assetId);

    if (!instance) return null;

    const result = await client.query(
      `
      SELECT *
      FROM "${assetId}"
      WHERE "id" = $1
    `,
      [id],
    );

    const row = result.rows[0];
    if (!row) return null;

    const { id: _id, index: _index, ...properties } = row;

    const [relations, issues, assetTag] = await Promise.all([
      get_instance.relations(assetId, id),
      get_instance.issues(id),
      find_asset.tag_by_id(assetId),
    ]);

    if (!assetTag) return null;

    return {
      id,
      asset: assetId,
      tag: {
        assetTag,
        index: instance.tag.index,
      },
      properties: await map_property_tags({
        ...properties,
        ...relations,
      }),
      status: issues.length === 0 ? "healthy" : "unhealthy",
    };
  },

  issues: async (id: InstanceId) => {
    const result = await client.query(
      `
        SELECT issue_code, field
        FROM healthy_issues
        WHERE instance_id = $1
        `,
      [id],
    );

    return result.rows;
  },

  relations: async (
    assetId: AssetId,
    id: InstanceId,
  ): Promise<Record<string, string[]>> => {
    const result = await client.query(
      `
    SELECT
      definition_id,
      asset_a_id,
      instance_a_id,
      asset_b_id,
      instance_b_id
    FROM instance_relations
    WHERE
      (asset_a_id = $1 AND instance_a_id = $2)
      OR
      (asset_b_id = $1 AND instance_b_id = $2)
    `,
      [assetId, id],
    );

    const relations: Record<string, string[]> = {};

    for (const row of result.rows) {
      const isA = row.asset_a_id === assetId && row.instance_a_id === id;

      const targetAssetId = (isA ? row.asset_b_id : row.asset_a_id) as AssetId;

      const targetInstanceId = (
        isA ? row.instance_b_id : row.instance_a_id
      ) as InstanceId;

      const targetInstance = await find_instance.by_id(
        targetInstanceId,
        targetAssetId,
      );

      if (!targetInstance) continue;

      const definitionRelations = relations[row.definition_id] ?? [];

      definitionRelations.push(`${targetAssetId}:${targetInstance.tag.index}`);

      relations[row.definition_id] = definitionRelations;
    }

    return relations;
  },
  all: async (assetId: AssetId): Promise<Instance[]> => {
    const result = await client.query(
      `
      SELECT *
      FROM "${assetId}"
    `,
    );

    return Promise.all(
      result.rows.map(async (row) => {
        const { id, index, ...properties } = row;
        const instanceId = id as InstanceId;

        const [relations, issues] = await Promise.all([
          get_instance.relations(assetId, instanceId),
          get_instance.issues(instanceId),
        ]);

        return {
          id: instanceId,
          asset: assetId,
          tag: {
            assetTag: (await find_asset.tag_by_id(assetId))!,
            index: Number(index),
          },
          properties: await map_property_tags({
            ...properties,
            ...relations,
          }),
          status: issues.length === 0 ? "healthy" : "unhealthy",
        };
      }),
    );
  },
};
