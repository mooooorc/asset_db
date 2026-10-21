import type { AssetId } from "../../asset/asset.domain.js";
import type { AssetService } from "../../asset/asset.service.js";
import { find_asset } from "../../asset/operations/find_asset.js";
import { client } from "../../db/client.js";
import type { DefinitionService } from "../../definition/definition.service.js";
import type { Instance, InstanceId } from "../instance.domain.js";
import { build_instance } from "./build_instance.js";
import { map_property_tags } from "./utils/map_property_tags.js";

export const get_instance = {
  self: async (
    asset_id: AssetId,
    id: InstanceId,
    definitionService: DefinitionService,
    assetService: AssetService,
  ): Promise<Instance | null> => {
    const result = await client.query(
      `
      SELECT *
      FROM "${asset_id}"
      WHERE id = $1
    `,
      [id],
    );

    const row = result.rows[0];
    if (!row) return null;

    const { id: _id, index, ...properties } = row;

    const asset_tag = await assetService.find_tag_by_id(asset_id);
    if (!asset_tag) return null;

    return build_instance.self(
      id,
      asset_id,
      asset_tag,
      Number(index),
      properties,
      definitionService,
    );
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
  const instanceUuid = id.split("/")[1];

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
    [assetId, instanceUuid],
  );

  const relations: Record<string, string[]> = {};

  for (const row of result.rows) {
    const isA =
      row.asset_a_id === assetId &&
      row.instance_a_id === instanceUuid;

    const targetAssetId = (isA ? row.asset_b_id : row.asset_a_id) as AssetId;
    const targetInstanceUuid = isA
      ? row.instance_b_id
      : row.instance_a_id;

    const indexResult = await client.query(
      `SELECT "index" FROM "${targetAssetId}" WHERE id = $1`,
      [targetInstanceUuid],
    );

    const index = indexResult.rows[0]?.index;

    if (index == null) continue;

    const definitionRelations = relations[row.definition_id] ?? [];
    definitionRelations.push(`${targetAssetId}:${Number(index)}`);
    relations[row.definition_id] = definitionRelations;
  }

  return relations;
},
  
  all: async (
    assetId: AssetId,
    definitionService: DefinitionService,
  ): Promise<Instance[]> => {
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
          get_instance.relations(
            assetId,
            instanceId,
          ),
          get_instance.issues(instanceId),
        ]);

        return {
          id: instanceId,
          asset: assetId,
          tag: {
            assetTag: (await find_asset.tag_by_id(assetId))!,
            index: Number(index),
          },
          properties: await map_property_tags(
            {
              ...properties,
              ...relations,
            },
            definitionService,
          ),
          status: issues.length === 0 ? "healthy" : "unhealthy",
        };
      }),
    );
  },
};
