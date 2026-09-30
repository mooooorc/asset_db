
import type { Definition } from "../../definition/definition.domain.js";
import { DefinitionService } from "../../definition/definition.service.js";

import type { Asset_table_column } from "../types.js";

export const get_columns = async (
  definition: Definition,
  definitionService: DefinitionService,
): Promise<Asset_table_column[]> => {
  if ("type" in definition) {
    if (definition.type === "relation") {
      return [];
    }
    return [
      {
        name: definition.id,
        type:
          definition.type === "string"
            ? "TEXT"
            : definition.type === "number"
              ? "DOUBLE PRECISION"
              : "BOOLEAN",
      },
    ];
  }

  const definitions = await Promise.all(
    definition.definitions.map((definitionId) =>
      definitionService.get(definitionId),
    ),
  );

  const columns = await Promise.all(
    definitions
      .filter((definition): definition is Definition => definition !== null)
      .map((definition) => get_columns(definition, definitionService)),
  );

  return columns.flat();
};