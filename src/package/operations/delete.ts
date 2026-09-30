import { client } from "../../db/client.js";
import type { PackageId } from "../package.domain.js";


export const delete_package = async (
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