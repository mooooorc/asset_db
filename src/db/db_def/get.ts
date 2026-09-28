import type { Definition, DefinitionId } from "../../domain/definition.js";
import { client } from "../client.js";

export const get_db_def = async (
  id: DefinitionId,
): Promise<Definition | null> => {
  const result = await client.query(
    `
      SELECT id, name, description, value_type
      FROM definitions
      WHERE id = $1
    `,
    [id],
  );

  const definition = result.rows[0];

  if (!definition) return null;

  const children = await client.query(
    `
      SELECT child_definition_id
      FROM definition_definitions
      WHERE definition_id = $1
    `,
    [id],
  );

  if (children.rows.length > 0) {
    return {
      id: definition.id,
      name: definition.name,
      ...(definition.description !== null && {
        description: definition.description,
      }),
      definitions: children.rows.map(
        (child) => child.child_definition_id as DefinitionId,
      ),
    };
  }

  return {
    id: definition.id,
    name: definition.name,
    ...(definition.description !== null && {
      description: definition.description,
    }),
    valueType: definition.value_type,
  };
};
