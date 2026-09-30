import { client } from "../../db/client.js";
import type { PackageCondition, PackageId } from "../package.domain.js";

export const save_package_conditions = async (
  packageId: PackageId,
  conditions: PackageCondition[],
): Promise<void> => {
  for (const condition of conditions) {
    await client.query(
      `
        INSERT INTO package_conditions (
          package_id,
          definition_id,
          operator,
          value
        )
        VALUES ($1, $2, $3, $4)
      `,
      [
        packageId,
        condition.definition,
        condition.operator,
        JSON.stringify(condition.value),
      ],
    );
  }
};