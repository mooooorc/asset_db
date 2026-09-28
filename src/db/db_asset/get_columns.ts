import type { Definition } from "../../domain/definition.js";
import { db_definition } from "../db_def/main.js";
import { db_type } from "../db_type/main.js";
import type { Asset_table_column } from "./types.js";


export const getColumns = async (
  definition: Definition,
): Promise<Asset_table_column[]> => {
  if ("type" in definition) {
    const type = await db_type.get(definition.type);

    if (!type) {
      throw new Error(`Type not found: ${definition.type}`);
    }

    return [
      {
        name: definition.id,
        type:
          type.baseType === "string"
            ? "TEXT"
            : type.baseType === "number"
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