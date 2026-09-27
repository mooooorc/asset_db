import type { PackageId } from "../../domain/package.js";
import { client } from "../client.js";

export const delete_db_package = async (
  id: PackageId,
): Promise<void> => {
  await client.query(
    `
      DELETE FROM packages
      WHERE id = $1
    `,
    [id],
  );
};