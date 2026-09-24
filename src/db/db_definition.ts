import { randomUUID } from "node:crypto";
import type {
  Definition,
  DefinitionId,
  NewDefinition,
} from "../domain/definition.js";
import { client } from "./client.js";

const insertDefinition = async (definition: Definition) => {
  await client.query(
    `
      INSERT INTO definitions (id, name, value_type)
      VALUES ($1, $2, $3)
    `,
    [
      definition.id,
      definition.name,
      "valueType" in definition ? definition.valueType : null,
    ],
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
      SELECT id, name, value_type
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
      definitions: children.rows.map(
        (child) => child.child_definition_id as DefinitionId,
      ),
    };
  }

  return {
    id: definition.id,
    name: definition.name,
    valueType: definition.value_type,
  };
}

const getParents = async (id: DefinitionId): Promise<DefinitionId[]> => {
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

const getLeafDefinitions = async (
  id: DefinitionId,
): Promise<DefinitionId[]> => {
  const definition = await getDefinition(id);

  if (!definition) {
    return [];
  }

  if ("valueType" in definition) {
    return [definition.id];
  }

  const children = await Promise.all(
    definition.definitions.map((childId) => getLeafDefinitions(childId)),
  );

  return children.flat();
};

export const db_definition = {
  save: async (def: NewDefinition): Promise<Definition> => {
    const definition = {
      ...def,
      id: randomUUID() as DefinitionId,
    };

    await insertDefinition(definition);

    return definition;
  },

  get: async (id: DefinitionId): Promise<Definition | null> => {
    return await getDefinition(id);
  },

  getAll: async (): Promise<Definition[]> => {
  const result = await client.query(
    `
      SELECT id, name, value_type
      FROM definitions
      ORDER BY name
    `,
  );

  return Promise.all(
    result.rows.map((row) =>
      getDefinition(row.id as DefinitionId),
    ),
  ).then((definitions) =>
    definitions.filter(
      (definition): definition is Definition =>
        definition !== null,
    ),
  );
},

  delete: async (id: DefinitionId) => {
    const parents = await getParents(id);
    const definitionIds = [id, ...parents];
    const leafDefinitions = await getLeafDefinitions(id);

    const assets = await client.query(
      `
      SELECT DISTINCT asset_id
      FROM asset_definitions
      WHERE definition_id = ANY($1)
    `,
      [definitionIds],
    );

    for (const row of assets.rows) {
      for (const leafDefinition of leafDefinitions) {
        await client.query(
          `
          ALTER TABLE "${row.asset_id}"
          DROP COLUMN "${leafDefinition}"
        `,
        );
      }
    }

    await client.query(
      `
      DELETE FROM definitions
      WHERE id = $1
    `,
      [id],
    );
  },

  getParents: async (id: DefinitionId) => {
    return await getParents(id);
  },

  getLeafDefinitions: async (id: DefinitionId) => {
    return await getLeafDefinitions(id);
  },
};
