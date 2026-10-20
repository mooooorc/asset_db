import { client } from "../../db/client.js";
import type { DefinitionId, DefinitionTag } from "../definition.domain.js";



export const find_definition = {

  
  id_by_tag: async (tag: DefinitionTag): Promise<DefinitionId | null> => {
    const result = await client.query(
      `
        SELECT id
        FROM definitions
        WHERE tag = $1
      `,
      [tag],
    );

    return result.rows[0]?.id ?? null;
  },

  tag_by_id: async (id: DefinitionId): Promise<DefinitionTag | null> => {
    const result = await client.query(
      `
        SELECT tag
        FROM definitions
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0]?.tag ?? null;
  },
};
