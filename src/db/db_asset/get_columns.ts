import type { Definition } from "../../domain/definition.js";
import { db_definition } from "../db_def/main.js";
import type { Asset_table_column } from "./types.js";


export const getColumns = async (definition: Definition): Promise<Asset_table_column[]> => {
  if ("valueType" in definition) {
    return [
      {
        name: definition.id,
        type:
          definition.valueType === "string"
            ? "TEXT"
            : definition.valueType === "number"
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
      .map(getColumns),
  );

  return columns.flat();
};