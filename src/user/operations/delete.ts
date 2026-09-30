import { client } from "../../db/client.js";
import type { UserId } from "../user.domain.js";

export const delete_user = async (
  id: UserId,
): Promise<void> => {
  await client.query(
    `
      DELETE FROM users
      WHERE id = $1
    `,
    [id],
  );
};