import type { TypeId } from "../../domain/type.js";
import { client } from "../client.js";

export const delete_db_type = async (id: TypeId) => {
  await client.query(
    `
      DELETE FROM types
      WHERE id = $1
    `,
    [id],
  );
};