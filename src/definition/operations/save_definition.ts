import { client } from "../../db/client.js";
import type { DefinitionData } from "../definition.domain.js";
import { randomUUID } from "node:crypto";
import { find_definition } from "./find_definition.js";

export const save_definition = async (
  definition: DefinitionData,
): Promise<DefinitionData> => {


  const id = randomUUID();

  await client.query(
    `
      INSERT INTO definitions (id, tag, name, description, type)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      id,
      definition.tag,
      definition.name,
      definition.description ?? null,
      "type" in definition ? definition.type : null,
    ],
  );

  if ("definitions" in definition) {
    for (const childTag of definition.definitions) {
      const childId = await find_definition.id_by_tag(childTag);

      if (!childId) {
        throw new Error(`Definition not found: ${childTag}`);
      }

      await client.query(
        `
          INSERT INTO definition_definitions (
            definition_id,
            child_definition_id
          )
          VALUES ($1, $2)
        `,
        [id, childId],
      );
    }
  }

  return definition;
};
