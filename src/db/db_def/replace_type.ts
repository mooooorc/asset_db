import type { TypeId } from "../../domain/type.js";
import { client } from "../client.js";

export const replace_db_definition_type = async (
  typeId: TypeId,
  replacementTypeId: TypeId,
) => {
  await client.query(
    `
      UPDATE definitions
      SET type_id = $2
      WHERE type_id = $1
    `,
    [typeId, replacementTypeId],
  );
};