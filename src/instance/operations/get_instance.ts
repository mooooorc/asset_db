import type { AssetId } from "../../asset/asset.domain.js";
import type { AssetService } from "../../asset/asset.service.js";
import { find_asset } from "../../asset/operations/find_asset.js";
import { client } from "../../db/client.js";
import type { DefinitionService } from "../../definition/definition.service.js";
import type { Instance, InstanceId } from "../instance.domain.js";
import { build_instance } from "./build_instance.js";
import { get_metadata } from "./get_metadata.js";
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
          get_metadata.relations(
            assetId,
            instanceId,
          ),
          get_metadata.issues(instanceId),
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
