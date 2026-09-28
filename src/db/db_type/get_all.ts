import type { Type, TypeId } from "../../domain/type.js";
import { client } from "../client.js";
import { get_db_type } from "./get.js";

export const get_all_db_types = async (): Promise<Type[]> => {
  const result = await client.query(
    `
      SELECT id
      FROM types
    `,
  );

  const types = await Promise.all(
    result.rows.map((type) => get_db_type(type.id as TypeId)),
  );

  return types.filter((type): type is Type => type !== null);
};
