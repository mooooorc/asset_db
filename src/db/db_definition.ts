import type { Definition, DefinitionId } from "../domain/definition.js";
import { client } from "./client.js";

const insertDefinition = async (definition: Definition) => {
  await client.query(
    `
      INSERT INTO definitions (id, value_type)
      VALUES ($1, $2)
    `,
    [definition.id, "valueType" in definition ? definition.valueType : null],
  );

  if ("definitions" in definition) {
    for (const childId of definition.definitions) {
      await client.query(
        `
          INSERT INTO definition_definitions (
            definition_id,
            child_definition_id
          )
          VALUES ($1, $2)
        `,
        [definition.id, childId],
      );
    }
  }
};

async function getDefinition(id: DefinitionId): Promise<Definition | null> {
  const result = await client.query(
    `
      SELECT id, value_type
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
      definitions: children.rows.map(
        (child) => child.child_definition_id as DefinitionId,
      ),
    };
  }

  return {
    id: definition.id,
    valueType: definition.value_type,
  };
}

export const db_definition = {
  save: async (def: Definition) => {
    await insertDefinition(def);
  },

  get: async (id: DefinitionId): Promise<Definition | null> => {
    return await getDefinition(id);
  },
};
