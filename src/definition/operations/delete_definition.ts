import { client } from "../../db/client.js";
import type { DefinitionId } from "../definition.domain.js";
import { get_definition } from "./get_definition.js";



export const delete_definition = async (
  definitionId: DefinitionId,
): Promise<void> => {
  const parents = await get_definition.parents(definitionId);
  const leafDefinitions = await get_definition.leaves(definitionId);

  const definitionIds = [definitionId, ...parents];

  const assets = await client.query(
    `
      SELECT DISTINCT asset_id
      FROM asset_definitions
      WHERE definition_id = ANY($1)
    `,
    [definitionIds],
  );

  for (const row of assets.rows) {
    for (const leafDefinitionId of leafDefinitions) {
      await client.query(
        `
          ALTER TABLE "${row.asset_id}"
          DROP COLUMN "${leafDefinitionId}"
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
    [definitionId],
  );
};
