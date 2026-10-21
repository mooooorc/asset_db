import { client } from "../../db/client.js";
import type {
  ConditionedPackage,
  LinkedPackage,
} from "../../package/package.domain.js";

export const persist_package =  {

    linked: async (pack: LinkedPackage) => {

        await client.query(
            `
             INSERT INTO packages (
                id,
                tag,
                name,
                linked_asset_id
            )
            VALUES ($1, $2, $3, $4)
            `,
            [pack.id, pack.tag, pack.name, pack.linkedAsset]
        )

        await client.query(
      `
            INSERT INTO discussion_counters (package_id)
            VALUES ($1)
            `,
      [pack.id],
    );
    },

    conditioned: async (pack: ConditionedPackage) => {
        await client.query(
            `
            INSERT INTO packages (
            id,
            tag,
            name
            )
            VALUES ($1, $2, $3)
            `,
            [pack.id, pack.tag, pack.name]
        );

        for (const condition of pack.conditions) {
            
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
                    pack.id, 
                    condition.definition,
                    condition.operator,
                    JSON.stringify(condition.value)
                ]
            )
        }

        await client.query(
            `
            INSERT INTO discussion_counters (package_id)
            VALUES ($1)
            `,
            [pack.id],
        )

    }
}
 


  
