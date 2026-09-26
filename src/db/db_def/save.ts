import type { Definition } from "../../domain/definition.js";
import { client } from "../client.js";

export const save_db_def = async (definition: Definition) => {
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