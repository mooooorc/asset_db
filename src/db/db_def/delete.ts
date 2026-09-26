import type { DefinitionId } from "../../domain/definition.js";
import { client } from "../client.js";
import { get_leaf_db_def } from "./get_leaf_def.js";
import { get_parents_db_def } from "./get_parents.js";

export const delete_db_def = async (id: DefinitionId) => {
  const parents = await get_parents_db_def(id);
  const definitionIds = [id, ...parents];
  const leafDefinitions = await get_leaf_db_def(id);

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
      DELETE FROM asset_definitions
      WHERE definition_id = ANY($1)
    `,
    [definitionIds],
  );

  await client.query(
    `
      DELETE FROM definitions
      WHERE id = $1
    `,
    [id],
  );
};
