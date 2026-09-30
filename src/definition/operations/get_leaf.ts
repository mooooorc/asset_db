
import type { DefinitionId } from "../definition.domain.js";
import { get_def } from "./get.js";

export const get_leaf_def = async (
  id: DefinitionId,
): Promise<DefinitionId[]> => {
  const definition = await get_def(id);

  if (!definition) {
    return [];
  }

  if ("type" in definition) {
    return [definition.id];
  }

  const children = await Promise.all(
    definition.definitions.map((childId) => get_leaf_def(childId)),
  );

  return children.flat();
};