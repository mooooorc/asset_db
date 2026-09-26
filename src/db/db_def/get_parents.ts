import type { DefinitionId } from "../../domain/definition.js";
import { client } from "../client.js";

export const get_parents_db_def = async (id: DefinitionId): Promise<DefinitionId[]> => {
  const result = await client.query(
    `
      WITH RECURSIVE parents AS (
        SELECT definition_id
        FROM definition_definitions
        WHERE child_definition_id = $1

        UNION

        SELECT dd.definition_id
        FROM definition_definitions dd
        INNER JOIN parents p
          ON dd.child_definition_id = p.definition_id
      )
      SELECT definition_id
      FROM parents
    `,
    [id],
  );

  return result.rows.map((row) => row.definition_id as DefinitionId);
};
