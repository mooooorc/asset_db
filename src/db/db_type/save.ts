import type { Type } from "../../domain/type.js";
import { client } from "../client.js";

export const save_db_type = async (type: Type) => {
  await client.query(
    `
      INSERT INTO types (
        id,
        name,
        base_type,
        default_value
      )
      VALUES ($1, $2, $3, $4)
    `,
    [
      type.id,
      type.name,
      type.baseType,
      type.default !== undefined
        ? JSON.stringify(type.default)
        : null,
    ],
  );
};