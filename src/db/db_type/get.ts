import type { Type, TypeId } from "../../domain/type.js";
import { client } from "../client.js";

export const get_db_type = async (
  id: TypeId,
): Promise<Type | null> => {
  const result = await client.query(
    `
      SELECT id, name, base_type, default_value
      FROM types
      WHERE id = $1
    `,
    [id],
  );

  const type = result.rows[0];

  if (!type) return null;

  return {
    id: type.id,
    name: type.name,
    baseType: type.base_type,
    ...(type.default_value !== null && {
      default: type.default_value,
    }),
  };
};