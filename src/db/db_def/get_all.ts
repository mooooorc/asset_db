import type { Definition, DefinitionId } from "../../domain/definition.js";
import { client } from "../client.js";
import { get_db_def } from "./get.js";

export const get_all_db_def =  async (): Promise<Definition[]> => {
  const result = await client.query(
    `
      SELECT id, name, value_type
      FROM definitions
      ORDER BY name
    `,
  );

  return Promise.all(
    result.rows.map((row) =>
      get_db_def(row.id as DefinitionId),
    ),
  ).then((definitions) =>
    definitions.filter(
      (definition): definition is Definition =>
        definition !== null,
    ),
  );
}