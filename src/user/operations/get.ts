import { client } from "../../db/client.js";
import type { User, UserId } from "../user.domain.js";

export const get_user = async (
  id: UserId,
): Promise<Omit<User, "password_hash"> | null> => {
  const result = await client.query(
    `
      SELECT
        id,
        name,
        email,
        password_hash
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id as UserId,
    name: row.name,
    email: row.email,
   
  };
};