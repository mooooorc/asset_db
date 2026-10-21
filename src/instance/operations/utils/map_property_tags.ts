import type { DefinitionId } from "../../../definition/definition.domain.js";
import type { DefinitionService } from "../../../definition/definition.service.js";


export const map_property_tags = async (
  properties: Record<string, unknown>,
  definitionService: DefinitionService
): Promise<Record<string, unknown>> => {
  const entries = await Promise.all(
    Object.entries(properties).map(async ([id, value]) => {
      const tag = await definitionService.get_by_id(id as DefinitionId)

      if (!tag) {
        throw new Error(`Definition not found: ${id}`);
      }

      return [tag.tag, value] as const;
    }),
  );

  return Object.fromEntries(entries);
};
