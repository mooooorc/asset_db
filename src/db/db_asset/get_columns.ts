import type { Definition } from "../../domain/definition.js";
import { db_definition } from "../db_def/main.js";

import type { Asset_table_column } from "./types.js";


export const get_columns = async (
  definition: Definition,
): Promise<Asset_table_column[]> => {
  if ("type" in definition) {
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
      db_definition.get(definitionId),
    ),
  );

  const columns = await Promise.all(
    definitions
      .filter((definition): definition is Definition => definition !== null)
      .map(get_columns),
  );

  return columns.flat();
};