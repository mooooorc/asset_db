import { client } from "../../db/client.js";

import * as argon2 from "argon2";
import type { Consumer } from "../consumer.domain.js";
import type { PackageId } from "../../package/package.domain.js";


export const verify_consumer = async (
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
      const packagesResult = await client.query(
        `
          SELECT package_id
          FROM consumer_packages
          WHERE consumer_id = $1
        `,
        [row.id],
      );

      return {
        id: row.id,
        name: row.name,
        packages: packagesResult.rows.map(
          (row) => row.package_id as PackageId,
        ),
      };
    }
  }

  return null;
};