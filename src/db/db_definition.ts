import pg from "pg";
import type { Definition, DefinitionId } from "../domain/definition.js";
import { client } from "./client.js";


const insertDefinition = async (
  definition: Definition,
  parentId: DefinitionId | null,
) => {
  await client.query(
    `
      INSERT INTO definitions (id, value_type, parent_id)
      VALUES ($1, $2, $3)
    `,
    [
      definition.id,
      "valueType" in definition ? definition.valueType : null,
      parentId,
    ],
  );

  if ("definitions" in definition) {
    for (const child of definition.definitions) {
      await insertDefinition(child, definition.id);
    }
  }
};

export const db_definition = {
  save: async (def: Definition) => {
    await client.connect();

    try {
      await insertDefinition(def, null);
    } finally {
      await client.end();
    }
  },

  get: async (id: DefinitionId): Promise<Definition | null> => {
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
      SELECT id, value_type
      FROM definitions
      WHERE parent_id = $1
    `,
    [id],
  );

  if (children.rows.length > 0) {
    return {
      id: definition.id,
      definitions: children.rows.map((child) => ({
        id: child.id,
        valueType: child.value_type,
      })),
    };
  }

  return {
    id: definition.id,
    valueType: definition.value_type,
  };
},
};
