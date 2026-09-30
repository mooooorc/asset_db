import { client } from "../../db/client.js";
import type { Definition, DefinitionId } from "../definition.domain.js";

import { get_def } from "./get.js";

export const get_all_defs = async (): Promise<Definition[]> => {
  const result = await client.query(
    `
      SELECT id, name, description
      FROM definitions
      ORDER BY name
    `,
  );

  return Promise.all(
    result.rows.map((row) =>
      get_def(row.id as DefinitionId),
    ),
  ).then((definitions) =>
    definitions.filter(
      (definition): definition is Definition =>
        definition !== null,
    ),
  );
};