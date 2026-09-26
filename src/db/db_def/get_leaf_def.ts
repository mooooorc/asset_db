import type { DefinitionId } from "../../domain/definition.js";
import { get_db_def } from "./get.js";

export const get_leaf_db_def = async (
  id: DefinitionId,
): Promise<DefinitionId[]> => {
  const definition = await get_db_def(id);

  if (!definition) {
    return [];
  }

  if ("valueType" in definition) {
    return [definition.id];
  }

  const children = await Promise.all(
    definition.definitions.map((childId) => get_leaf_db_def(childId)),
  );

  return children.flat();
};