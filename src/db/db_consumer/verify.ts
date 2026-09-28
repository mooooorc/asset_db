import * as argon2 from "argon2";

import type { Consumer } from "../../domain/consumer.js";
import { client } from "../client.js";

export const verify_db_consumer = async (
  credential: string,
): Promise<Consumer | null> => {
  const result = await client.query(
    `
      SELECT id, name, credential_hash
      FROM consumers
    `,
  );

  for (const row of result.rows) {
    const valid = await argon2.verify(
      row.credential_hash,
      credential,
    );

    if (valid) {
      return {
        id: row.id,
        name: row.name,
      };
    }
  }

  return null;
};