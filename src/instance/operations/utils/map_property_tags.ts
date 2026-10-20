import type { DefinitionId } from "../../../definition/definition.domain.js";
import { get_definition } from "../../../definition/operations/get_definition.js";

export const map_property_tags = async (
  properties: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  const entries = await Promise.all(
    Object.entries(properties).map(async ([id, value]) => {
      const tag = await get_definition.self(id as DefinitionId);

      if (!tag) {
        throw new Error(`Definition not found: ${id}`);
      }

      return [tag.tag, value] as const;
    }),
  );

  return Object.fromEntries(entries);
};
