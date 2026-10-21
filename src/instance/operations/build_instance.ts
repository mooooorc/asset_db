import type { AssetId, AssetTag } from "../../asset/asset.domain.js";
import type { DefinitionService } from "../../definition/definition.service.js";
import type { Instance, InstanceId } from "../instance.domain.js";
import { get_instance } from "./get_instance.js";
import { map_property_tags } from "./utils/map_property_tags.js";

export const build_instance = {
  self: async (
    id: InstanceId,
    asset_id: AssetId,
    asset_tag: AssetTag,
    index: number,
    properties: Record<string, unknown>,
    definitionService: DefinitionService,
  ): Promise<Instance> => {
    const [relations, issues] = await Promise.all([
      get_instance.relations(
        asset_id,
        id
      ),
      get_instance.issues(id),
    ]);

    return {
      id,
      tag: {
        assetTag: asset_tag,
        index,
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
  },
};