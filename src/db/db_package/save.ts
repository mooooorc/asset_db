import type { Package } from "../../domain/package.js";
import { client } from "../client.js";

export const save_db_package = async (pack: Package): Promise<Package> => {

    await client.query(
          `
          INSERT INTO packages (id, name, condition_definition, condition_value)
          VALUES ($1, $2, $3, $4)
        `,
          [
            pack.id,
            pack.name,
            pack.condition?.definition ?? null,
            pack.condition ? JSON.stringify(pack.condition.value) : null,
          ],
        );
    
        return pack;
}