import { client } from "../../db/client.js";
import type {
  Definition,
  DefinitionId,
  DefinitionTag,
  DefinitionValueType,
} from "../definition.domain.js";

export const get_definition = (() => {
  const obtain_row = async (id: DefinitionId) => {
    const result = await client.query(
      `
        SELECT id, tag, name, description, type
        FROM definitions
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  };

  return {
    self: async (id: DefinitionId): Promise<Definition | null> => {
      const definition = await obtain_row(id);
      if (!definition) return null;

      const children = await client.query(
        `
          SELECT child_definition_id
          FROM definition_definitions
          WHERE definition_id = $1
        `,
        [id],
      );

      const base = {
        id: definition.id as DefinitionId,
        tag: definition.tag as DefinitionTag,
        name: definition.name,
        ...(definition.description !== null && {
          description: definition.description,
        }),
      };

      if (definition.type === "composite") {
        return {
          ...base,
          type: "composite",
          definitions: children.rows.map(
            (child) => child.child_definition_id as DefinitionId,
          ),
        };
      }

      return { ...base, type: definition.type };
    },

    all: async (): Promise<Definition[]> => {
      const result = await client.query(`
    SELECT
      d.id,
      d.tag,
      d.name,
      d.description,
      d.type,
      COALESCE(
        json_agg(child.id) FILTER (WHERE child.id IS NOT NULL),
        '[]'
      ) AS children
    FROM definitions d
    LEFT JOIN definition_definitions dd
      ON dd.definition_id = d.id
    LEFT JOIN definitions child
      ON child.id = dd.child_definition_id
    GROUP BY d.id
    ORDER BY d.name
  `);

      return result.rows.map((row) => {
        const base = {
          id: row.id as DefinitionId,
          tag: row.tag as DefinitionTag,
          name: row.name,
          ...(row.description !== null && {
            description: row.description,
          }),
        };

        if (row.type === "composite") {
          return {
            ...base,
            type: "composite" as const,
            definitions: row.children as DefinitionId[],
          };
        }

        return {
          ...base,
          type: row.type as DefinitionValueType,
        };
      });
    },

    parents: async (id: DefinitionId): Promise<DefinitionId[]> => {
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
    },

    leaves: async (id: DefinitionId): Promise<DefinitionId[]> => {
      const definition = await get_definition.self(id);

      if (!definition) return [];

      if (definition.type !== "composite") {
        return [definition.id];
      }

      const children = await Promise.all(
        definition.definitions.map((childId) => get_definition.leaves(childId)),
      );

      return children.flat();
    },
  };
})();
