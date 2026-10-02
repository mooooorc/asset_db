import { client } from "../../db/client.js";
import type { User, UserId } from "../user.domain.js";

export const get_all_users = async (): Promise<User[]> => {
  const result = await client.query(
    `
      SELECT
        id,
        name,
        email,
        roles
      FROM users
      ORDER BY id
    `,
  );

  return result.rows.map((row) => ({
    id: row.id as UserId,
    name: row.name,
    email: row.email,
    roles: row.roles
  }));
};